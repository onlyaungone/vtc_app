import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Button } from 'react-native';

import {Stack, useRouter} from 'expo-router';
import { DynamoDBClient, ScanCommand, AttributeValue } from '@aws-sdk/client-dynamodb';
import { signOut } from 'aws-amplify/auth';
import { Buffer } from 'buffer';
import { useFocusEffect } from '@react-navigation/native';
import { TrainerSpecialties } from '@/constants/TrainerInfo';
import {useAuth} from "@/context/AuthContext";
import calculateAvailabilityMatchScore from "@/utils/calculateAvailabilityMatchScore";
import {fetchTrainerImages} from "@/utils/fetchTrainerImages";

const TABLE = 'PersonalTrainer-ycmuiolpezdtdkkxmiwibhh6e4-staging'; // DynamoDB table name

// Define the Trainer interface for type safety
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

export const getTrainerSpecialtyLabel = (value: string | undefined) => {
  const specialty = TrainerSpecialties.find(specialty => specialty.value === value);
  return specialty ? specialty.label : value; // Return label if found, otherwise return value
};

export default function TrainersListScreen() {
  const router = useRouter();  // Using expo-router's useRouter hook
  const { user } = useAuth();
  const [matchedTrainers, setMatchedTrainers] = useState<Trainer[]>([]); // State to store matched trainers
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState<string | null>(null);  // Error state

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
        TableName: "OnlineClient-ycmuiolpezdtdkkxmiwibhh6e4-staging",
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
          trainerAge: item.trainerAge?.N,
          trainerGender:item.trainerGender?.S ,
          trainerEducation:item.trainerEducation?.S,
          trainerExperience:  item.trainerExperience?.N ,
          niche: item.niche?.S ,
          bio: item.bio?.S,
          __typename: item.__typename?.S
        };
      });
      const findClient = items?.find(element => element.sub === user);
      console.log("client availability",findClient?.availability)
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

// Calculate match score between client and trainer
  const calculateMatchScore = (client: any, trainer: any) => {
    let score = 0;

    // Gender Match
    if(client.trainerGender == "Not Important"){
      score += 0;
      console.log(`Trainer: ${trainer.name?.S} - Gender Doesnt matter! Client Gender: ${client.trainerGender}, Trainer Gender: ${trainer.gender?.S}, Score: ${score}`);
    }
    else if (trainer.gender?.S === client.trainerGender) {
      score += 40; // Higher weight for gender match
      console.log(`Trainer: ${trainer.name?.S} - Gender Match! Client Gender: ${client.trainerGender}, Trainer Gender: ${trainer.gender?.S}, Score: ${score}`);
    } else {
      console.log(`Trainer: ${trainer.name?.S} - No Gender Match. Client Gender: ${client.trainerGender}, Trainer Gender: ${trainer.gender?.S}`);
    }

// Training Style Match

      const clientGoalsArray = client.goals?.map((goal: { S: string }) => goal.S) || [];

      // The trainer speciliates need to be updated to array since they can add more than one until then
      // const trainerTrainingStyle = trainer.niche?.map((niche: {S:string}) => niche.S) || [];
      // console.log(trainerTrainingStyle)

      // Until then, Handle trainer's niche, converting it into an array if it's a comma-separated string
      const trainerNicheArray = Array.isArray(trainer.niche?.S)
        ? trainer.niche?.S
        : trainer.niche?.S ? trainer.niche?.S.split(',').map((n: string) => n.trim()) : [];

      // Find common preferences between client goals and trainer niche
      const commonPref = trainerNicheArray.filter((niche: string) => clientGoalsArray.includes(niche));

      // Matching logic
      if (commonPref.length > 0) {
        const matchRatio = commonPref.length / Math.min(trainerNicheArray.length, clientGoalsArray.length);

        if (matchRatio === 1) {
          score += 30; // Full match
        } else if (matchRatio >= 0.5 && matchRatio < 1) {
          score += 20; // Partial match (at least 50%)
        } else {
          score += 10; // Less than 50% match
        }
      }


    if (trainer.niche?.S === client.niche) {
      score += 30; // Niche match
      console.log(`Trainer: ${trainer.name?.S} - Niche Match! Client Niche: ${client.niche}, Trainer Niche: ${trainer.niche?.S}, Score: ${score}`);
    } else {
      console.log(`Trainer: ${trainer.name?.S} - No Niche Match. Client Niche: ${client.niche}, Trainer Niche: ${trainer.niche?.S}`);
    }

    score += calculateAvailabilityMatchScore(trainer, client)
      // console.log(`Trainer: ${trainer.name?.S} - Availability Match! Common Days: ${commonDays}, Score: ${score}`);

    // Age Match
    const trainerAge = parseInt(trainer.age?.N, 10);
    const clientPreferredTrainerAge = parseInt(client.trainerAge, 10);
    const ageDifference = Math.abs(trainerAge - clientPreferredTrainerAge);
    if(clientPreferredTrainerAge == -1){
      score +=0;
      console.log(`Trainer: ${trainer.name?.S} -  Age doesn't Matter! Age Difference: ${ageDifference}, Score: ${score}`);
    }
    else if (ageDifference <= 5) {
      score += 10;
      console.log(`Trainer: ${trainer.name?.S} - Close Age Match! Age Difference: ${ageDifference}, Score: ${score}`);
    } else if (ageDifference > 5 && ageDifference <= 10) {
      score += 5;
      console.log(`Trainer: ${trainer.name?.S} - Moderate Age Match! Age Difference: ${ageDifference}, Score: ${score}`);
    } else {
      console.log(`Trainer: ${trainer.name?.S} - No Age Match. Trainer Age: ${trainerAge}, Client Preferred Age: ${clientPreferredTrainerAge}`);
    }

    // Education Level Match
    if (client.trainerEducation == "Not Important"){
      score += 0;
      console.log(`Trainer: ${trainer.name?.S} - Education Doesn't Matter! Client Education: ${client.trainerEducation}, Trainer Education: ${trainer.education?.S}, Score: ${score}`);
    }
    else if (trainer.education?.S === client.trainerEducation) {
      score += 5;
      console.log(`Trainer: ${trainer.name?.S} - Education Level Match! Client Education: ${client.trainerEducation}, Trainer Education: ${trainer.education?.S}, Score: ${score}`);
    } else {
      console.log(`Trainer: ${trainer.name?.S} - No Education Level Match. Client Education: ${client.trainerEducation}, Trainer Education: ${trainer.education?.S}`);
    }

    return score;
  };

  // Match trainers based on client preferences
  // Function to match trainers and update state
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
          age:  trainer.age as { N: string },
          education: trainer.education as { S: string },
          image: trainer.image as { S: string },
          matchScore: calculateMatchScore(clientDetails, trainer),  // Calculate match score
        };
      });

      // Sort trainers based on matchScore
      const sortedTrainers = matchedTrainers.sort((a, b) => b.matchScore - a.matchScore);
      const filteredTrainers = sortedTrainers.filter(trainer => trainer.matchScore > 0);

      await fetchTrainerImages(filteredTrainers, setMatchedTrainers);
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
      console.log('useFocusEffect triggered');
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
        // onPress={() => router.push(`/onboarding/client/trainerDetails?id=${item.id?.S}`)}
        onPress={() => router.push({
          pathname: '/onboarding/client/trainerDetails',  // Navigate to the TrainerDetails screen
          params: {
            id: item.id?.S,  // Pass trainer ID
            clientSub: user,
            clientType: "Online",  // Pass client type (__typename)
          },
        })}
      >
        <View style={styles.profileContainer}>
          <Image source={item.imageUri ? { uri: item.imageUri  } : require('@/assets/images/profile.png')} style={styles.profileImage} />
          <View style={styles.cardContent}>
            <Text style={styles.trainerName}>{item.name?.S}</Text>
            <Text style={styles.trainerSpecialty}>{getTrainerSpecialtyLabel(item.niche?.S)}</Text>
            <Text style={styles.matchScore}>Match Score: {item.matchScore}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackVisible: false,
            headerTransparent: true,
            headerTintColor: '#D9D9D9',
          }}
      />
      <Text style={styles.heading}>Trainers</Text>
      <Text style={styles.secondHeading}>Based on what you're looking for</Text>

      <FlatList
        data={matchedTrainers}
        renderItem={renderTrainer}
        keyExtractor={item => item.id?.S}
        ListEmptyComponent={<Text style={styles.noTrainersText}>No trainers found.</Text>}
      />
      <Button title="Refresh Trainers" onPress={handleRefresh} />
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    left: 5,
    top: 10,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#9B9B9B',
  },
  heading: {
    fontSize: 40,
    fontWeight: '500',
    color: '#000',
    marginTop: 20,
  },
  secondHeading: {
    fontSize: 18,
    fontWeight: '400',
    color: '#9B9B9B',
    marginTop: 10,
    marginBottom: 20,
  },
  noTrainersText: {
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
    width: '100%',
    height: 120,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F4F6F9',
  },
  cardContent: {
    marginLeft: 20,
    justifyContent: 'center',
  },
  trainerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  trainerSpecialty: {
    fontSize: 16,
    color: '#9B9B9B',
  },
  matchScore: {
    fontSize: 14,
    color: '#333',
  },
});


