import React, {useCallback, useState} from 'react';
import {Button, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AttributeValue, DynamoDBClient, ScanCommand} from '@aws-sdk/client-dynamodb';
import {Stack, useFocusEffect, useRouter} from 'expo-router';
import {useAuth} from "@/context/AuthContext";
import calculateAvailabilityMatchScore from "@/utils/calculateAvailabilityMatchScore";
import {fetchTrainerImages} from "@/utils/fetchTrainerImages";

const TABLE = 'PersonalTrainer-ycmuiolpezdtdkkxmiwibhh6e4-staging'; // DynamoDB table name

interface Trainer {
  id: { S: string };
  name?: { S: string };
  gender?: { S: string };
  niche?: { S: string };
  availability?: { L: Array<{ S: string }> };
  age?: { N: string };
  educationLevel?: { S: string };
  image?: { S: string };
  imageUri?: string | null;
  matchScore: number;
}

export default function matchLocation () {
  const { user, logout } = useAuth();
  const router = useRouter();  // Using expo-router's useRouter hook
  const [matchedTrainers, setMatchedTrainers] = useState<Trainer[]>([]); // State to store matched trainers
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState<string | null>(null);  // Error state
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [gymTrainers, setGymTrainers] = useState<Trainer[]>([]);
  const [clientLocation, setClientLocation] = useState<string | null>(null); // Sample client location
  const [gymLocation, setGymLocation] = useState<string | null>(null); // Sample gym location

  global.Buffer = global.Buffer || Buffer;

  const client = new DynamoDBClient({
    region: process.env.EXPO_PUBLIC_AWS_REGION || 'ap-southeast-2',
    credentials: {
      accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
    },
  });


  // Fetch the client details from AWS Cognito
  const fetchClientDetails = async () => {
    try {
      // Define the parameters for ScanCommand to fetch client details
      const params = {
        TableName: "InPersonClient-ycmuiolpezdtdkkxmiwibhh6e4-staging",
        Key: {
          sub: { S: user },  // Using the 'sub' as the key to retrieve user details
        },
      };

      // Execute the ScanCommand
      console.log(params);
      const command = new ScanCommand(params);
      const data = await client.send(command);

      // Format retrieved client data
      const items = data.Items?.map(item => {

        return {
          id: item.id?.S,
          name: item.name?.S,
          age: item.age?.N,
          sub: item.sub?.S,
          gender: item.gender?.S,
          availability: item.availability?.L,
          goals: item.goals?.L,
          gymLocation: item.gymLocation?.S,
          location: item.location?.S,
          bio: item.bio?.S,
          __typename: item.__typename?.S
        };
      });
      const findClient = items?.find(element => element.sub === user);
      console.log("client availability",findClient?.availability)

      setGymLocation(findClient?.gymLocation || null);


      return findClient;

    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };

  // Fetch trainers from DynamoDB
  const fetchTrainers = async () => {
    try {
      const params = { TableName: TABLE };
      const command = new ScanCommand(params);
      const data = await client.send(command);
      // console.log(data.Items);
      return data.Items || [];  // Ensure trainers return an array even if no data
    } catch (error) {
      console.error("Error fetching trainers: ", error);
      return [];
    }
  };

  // useEffect(() => {
  //   // Simulate fetching from DB by directly setting the hardcoded values
  //   const nearbyTrainers = hardcodedTrainers.filter(trainer => {
  //     const [lat, lng] = trainer.location.split(',').map(Number);
  //     const distance = haversine(clientLocation, { latitude: lat, longitude: lng }, { unit: 'mile' });
  //     trainer.distance = distance; // Assign calculated distance
  //     return distance <= 200;
  //   });

  //   const gymTrainersList = hardcodedTrainers.filter(trainer => trainer.gymLocation === gymLocation);

  //   setTrainers(nearbyTrainers);
  //   setGymTrainers(gymTrainersList);
  // }, [clientLocation, gymLocation]);

  // Calculate match score between client and trainer
  const calculateMatchScore = (client: any, trainer: any) => {
    let score = 0;

    score += calculateAvailabilityMatchScore(trainer, client)

  // Age Match -- Temproray until the actual match logic for location and suburb is done.
  // This is comparing client age and trainer age which is not correct but just a placement until future updates

  const trainerAge = parseInt(trainer.age?.N, 10);
  const clientAge = parseInt(client.age, 10);
  const ageDifference = Math.abs(trainerAge - clientAge);
  if (ageDifference <= 5) {
    score += 10;
    console.log(`Trainer: ${trainer.name?.S} - Close Age Match! Age Difference: ${ageDifference}, Score: ${score}`);
  } else if (ageDifference > 5 && ageDifference <= 10) {
    score += 5;
    console.log(`Trainer: ${trainer.name?.S} - Moderate Age Match! Age Difference: ${ageDifference}, Score: ${score}`);
  } else {
    console.log(`Trainer: ${trainer.name?.S} - No Age Match. Trainer Age: ${trainerAge}, Client Preferred Age: ${clientAge}`);
  }
  return score;
};

const matchTrainers = async () => {
  try {
    setLoading(true);
    setError(null);

    const clientDetails = await fetchClientDetails();  // Fetch client details from DynamoDB
    if (!clientDetails) {
      throw new Error("Client details not found.");
    }

    const trainers = await fetchTrainers();            // Fetch trainers from DynamoDB

    const matchedTrainers = trainers.map((trainer: Record<string, AttributeValue>) => {
      return {
        id: trainer.id as { S: string },
        name: trainer.name as { S: string },
        gender: trainer.gender as { S: string },
        niche: trainer.niche as { S: string },
        availability: trainer.availability as { L: Array<{ S: string }> },
        age: trainer.age as { N: string },
        education: trainer.education as { S: string },
        image: trainer.image as { S: string },
        matchScore: calculateMatchScore(clientDetails, trainer),  // Calculate match score
      };
    });

    // Sort trainers based on matchScore
    const sortedTrainers = matchedTrainers.sort((a, b) => b.matchScore - a.matchScore);
    const filteredTrainers = sortedTrainers.filter(trainer => trainer.matchScore > 0);

    await fetchTrainerImages(filteredTrainers, setMatchedTrainers); // Fetch images for trainers
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    }
  } finally {
    setLoading(false);
  }
};

  // Refresh the table when the screen is focused
  useFocusEffect(
    useCallback(() => {
      matchTrainers();  // Fetch data when screen is focused
    }, [])
  );

  // Manual refresh handler
  const handleRefresh = async () => {
    setMatchedTrainers([]); // Clear existing data
    await matchTrainers();  // Re-fetch data
  };

// Render individual trainer card
const renderTrainer = ({ item }: { item: Trainer }) => {
  return (
    <TouchableOpacity
      style={styles.card}

      onPress={() => router.push({
        pathname: '/onboarding/client/trainerDetails',  // Navigate to the TrainerDetails screen
        params: {
          id: item.id?.S,  // Pass trainer ID
          clientSub: user,
          clientType: "InPerson",  //
        },
      })}
    >
      <View style={styles.profileContainer}>
        <Image source={item.imageUri ? { uri: item.imageUri  } : require('@/assets/images/profile.png')} style={styles.profileImage} />
        <View style={styles.cardContent}>
          <Text style={styles.trainerName}>{item.name?.S}</Text>
          <Text style={styles.trainerSpecialty}>{item.niche?.S}</Text>
          <Text style={styles.matchScore}>Match Score: {item.matchScore}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

  // Main component render
  return (
      <SafeAreaView style={styles.screenContainer}>
      <Stack.Screen
              options={{
                headerShown: true,
                headerTitle: '',
                headerBackVisible: true,
                headerTransparent: true,
                headerTintColor: '#D9D9D9',
              }}
            />

      <Text style={styles.heading}>Trainers</Text>
      <Text style={styles.secondHeading}>Based at {gymLocation}</Text>

      <FlatList
        data={matchedTrainers.filter((trainer) => trainer.matchScore >= 20)}
        renderItem={renderTrainer}
        keyExtractor={item => item.id?.S}
        ListEmptyComponent={<Text style={styles.noTrainersText}>No trainers found at your gym</Text>}
      />

      <Text style={styles.secondHeading}>Other nearby trainers</Text>
      <FlatList
        data={matchedTrainers.filter((trainer) => trainer.matchScore < 20)}
        renderItem={renderTrainer}
        keyExtractor={item => item.id?.S}
        ListEmptyComponent={<Text style={styles.noTrainersText}>No nearby trainers found.</Text>}
      />

      <Button title="Refresh Trainers" onPress={handleRefresh} />
        <Button title="Logout" onPress={logout} />
    </SafeAreaView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 40,
  },
  backButton: {
    position: 'absolute',
    width: 32,
    height: 32,
    left: 5,
    top: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#9B9B9B',
    fontSize: 24,
  },
  heading: {
    fontFamily: 'Josefin Sans',
    fontSize: 40,
    fontWeight: '500',
    lineHeight: 50,
    letterSpacing: -0.32,
    color: '#000000',
    marginTop: 40,
    textAlign: 'left',
  },
  secondHeading: {
    fontFamily: 'Josefin Sans',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: -0.32,
    color: '#9B9B9B',
    textAlign: 'left',
    marginVertical: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  noTrainersText: {
    fontFamily: 'Josefin Sans',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 100,
  },
  card: {
    backgroundColor: '#F4F6F9',
    borderRadius: 15,
    padding: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: 380,
    height: 120,
    marginLeft: 15,
    marginRight: 31,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F4F6F9',
  },
  cardContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 10,
  },
  trainerName: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Josefin Sans',
    lineHeight: 21,
    color: '#000',
    width: 236,
  },
  trainerSpecialty: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    fontWeight: '400',
    color: '#9B9B9B',
  },
  matchScore: {
    fontSize: 14,
    color: '#333',
  },

});

