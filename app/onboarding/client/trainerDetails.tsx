import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router'; // useSearchParams to get trainerId
import { AttributeValue,DynamoDBClient, ScanCommand, PutItemCommand } from '@aws-sdk/client-dynamodb'; // Import GetItemCommand for fetching a specific item
import { Buffer } from 'buffer';
import {Days} from "@/schemas/onboarding/client/details";
import { Education } from '@/schemas/onboarding/client/experience';
import { TrainingStyle } from '@/schemas/onboarding/client/experience';
import { getTrainerSpecialtyLabel } from './online/match';
import * as Crypto from 'expo-crypto';
import { LinearGradient } from 'expo-linear-gradient';
import {getUrl} from "aws-amplify/storage";

const TABLE_NAME = 'PersonalTrainer-ycmuiolpezdtdkkxmiwibhh6e4-staging'; // DynamoDB table name

global.Buffer = global.Buffer || Buffer; // Ensure Buffer is available globally

interface TrainerDetails {
  id?: string;
  age?: string;
  availability?: (string | undefined)[];
  bio?: string;
  education?: string;
  experience?: string;
  gender?: string;
  gymLocation?: string;
  image?: string;
  location?: string;
  name?: string;
  niche?: string;
  sub?: string;
  testimonial?:string;
  resultsPhotos?: string[];
  quote?:string;
  __typename?: string;

  // Can add more fields as necessary when you fetch more data
}

export default function TrainerDetailsScreen() {
  const router = useRouter();
  const { id,clientType,clientSub } = useLocalSearchParams(); // Get the `trainerId` from the URL
  const [trainerDetails, setTrainerDetails] = useState<TrainerDetails | null>(null);// Use state to store the fetched trainer details
  const [loading, setLoading] = useState(true); // Loading state while fetching
  const [trainerImg, setTrainerImg] = useState<string | null>(null); // State to store trainer image pre-signed URL
  const [trainerResultPhotos, setTrainerResultPhotos] = useState<(string)[]>([]);

  const client = new DynamoDBClient({
    region: process.env.EXPO_PUBLIC_AWS_REGION || 'ap-southeast-2',
    credentials: {
      accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
    },
  });

   // Fetch trainer details using ScanCommand and find the correct trainer based on userSub
   const fetchTrainerDetails = async (trainerId: string) => {
    try {
      const params = {
        TableName: TABLE_NAME,
      };
      const command = new ScanCommand(params); // Scan the DynamoDB table
      const data = await client.send(command);

      const items = data.Items?.map(item => {
        // Map over items and return the desired format
        return {
          id: item.id?.S,
          age: item.age?.N,
          availability: item.availability?.L?.map(avail => avail.S),
          bio:item.bio?.S,
          education: item.education?.S,
          experience: item.experience?.N,
          gender: item.gender?.S,
          gymLocation: item.gymLocation?.S,
          image:item.image?.S,  //Its an URI for S3 that has the image stored
          location: item.location?.S,
          name: item.name?.S,
          niche:item.niche?.S,
          quote:item.quote?.S,
          sub: item.sub?.S,
          testimonial: item.testimonials?.S,
          resultsPhotos: item.resultsPhotos?.L?.map(photo => photo.S).filter((photo): photo is string => !!photo),
          __typename: item.__typename?.S,
        };
      });

      // Find the trainer by ID or sub (if applicable)
      const trainer = items?.find((element) => {
        return element.id === trainerId; // Assuming you're using `id` to match trainers
      });

      if (trainer) {
        if (trainer.image) {
          try {
            const imgUrl = await getUrl({
              path: trainer.image,
              options: {
                validateObjectExistence: true,
              },
            });
            setTrainerImg(imgUrl.url.toString())
          } catch (error) {
            console.error('Error fetching image from S3:', error);
          }
        }
        if (trainer.resultsPhotos) {
          try {
            trainer.resultsPhotos.map(async (photo) => {
              const imgUrl = await getUrl({
                path: photo,
                options: {
                  validateObjectExistence: true,
                },
              });
              setTrainerResultPhotos(prev => [...prev, imgUrl.url.toString()])
            })
          } catch (error) {
            console.error('Error fetching results photos from S3:', error);
          }
        }
      }
      setTrainerDetails(trainer || null); // Set the trainer details or null if not found
    } catch (error) {
      console.error('Error fetching trainer details:', error);
    } finally {
      setLoading(false); // Stop loading once fetching is complete
    }
  };


  const saveMatchToDynamoDB = async (item: {
    id: string;
    inpersonclientID?: string; // Optional fields
    onlineclientID?: string;    // Optional fields
    personaltrainerID: string;
    status: string;
    __typename: string;
    createdAt: string;
  }) => {
    try {
      // Dynamically construct the Item object, only including fields if they exist
      const params: any = {
        TableName: "Match-ycmuiolpezdtdkkxmiwibhh6e4-staging",
        Item: {
          id: { S: item.id }, // Always present
          personaltrainerID: { S: item.personaltrainerID }, // Ensure this is saved
          status: { S: item.status },  // Always present
          __typename: { S: item.__typename }, // Always present
        },
      };

      // Conditionally add inpersonclientID if it exists
      if (item.inpersonclientID) {
        params.Item.inpersonclientID = { S: item.inpersonclientID };
      }

      // Conditionally add onlineclientID if it exists
      if (item.onlineclientID) {
        params.Item.onlineclientID = { S: item.onlineclientID };
      }

      const command = new PutItemCommand(params);
      const result = await client.send(command);

      console.log('Data saved successfully:', result);
      Alert.alert('Success', 'Match saved successfully!');
    } catch (error) {
      console.error('Error saving data to DynamoDB:', error);
      Alert.alert('Error', 'Failed to save data to DynamoDB.');
    }
  };

  const handleSelectTrainer = async () => {
    if (!trainerDetails?.sub) {
      Alert.alert('Error', 'Trainer details are incomplete.');
      return;
    }

    const newMatch = {
      id: Crypto.randomUUID(),
      inpersonclientID: clientType === 'InPerson' ? clientSub : undefined,  // Undefined if not inPerson
      onlineclientID: clientType === 'Online' ? clientSub : undefined,     // Undefined if not online
      personaltrainerID: trainerDetails.sub,
      status: 'Pending',
      __typename: 'Match',
      createdAt: new Date().toISOString()
    };

    await saveMatchToDynamoDB(newMatch);

    router.push({
      pathname: '/onboarding/client/selectedTrainer',
      params: {
        trainerId: trainerDetails.id,
        name: trainerDetails.name,
        image: trainerDetails.image, // Use real image or placeholder
        niche: trainerDetails.niche,
      },
    });
  };

  // Fetch trainer details when the component mounts
  useEffect(() => {
    if (id) {
      fetchTrainerDetails(id as string);
    }
  }, [id]);

  if (loading) {
    return <Text>Loading...</Text>; // Display a loading message or spinner while fetching
  }

  if (!trainerDetails) {
    return <Text>Trainer not found</Text>; // Show a message if trainer details are not available
  }

  const userImages = [
    { id: 1, src: require('@/assets/images/client1.png') },
    { id: 2, src: require('@/assets/images/client2.png') },
    { id: 3, src: require('@/assets/images/client3.png') },
    // { id: 4, src: { uri: 'https://via.placeholder.com/150' } },
  ];

  const formatAvailability = (trainerAvailability: (string | undefined)[] = []) => {
    // Safely filter out undefined values and format the availability
    const availabilityValues = trainerAvailability
      .filter((item): item is string => !!item) // Filter out undefined values
      .map(item => Days[item as keyof typeof Days]); // Map over valid string items

    if (availabilityValues.length === 0) return 'No availability'; // Handle the case where there is no availability
    if (availabilityValues.length === 1) return availabilityValues[0]; // Handle single value
    return availabilityValues.slice(0, -1).join(', ') + ' and ' + availabilityValues.slice(-1);
  };


  // Render the fetched trainer details
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackVisible: true,
          headerTransparent: true,
          headerTintColor: '#D9D9D9',
        }}
      />

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Header Section */}
        <View style={styles.frame}>
          <View style={styles.profileContainer}>
            <Image
              source={trainerImg != null ? { uri: trainerImg } : require('@/assets/images/profile.png')} // Replace with actual image
              style={styles.profilePic}
            />
            <View style={styles.clientInfoContainer}>
              <View style={styles.nameEditRow}>
                <Text style={styles.clientName}>{trainerDetails.name}</Text>
              </View>
              <Text style={styles.clientInfo}>Age: {trainerDetails.age}</Text>
              <Text style={styles.clientInfo}>Gender: {trainerDetails.gender}</Text>
              <Text style={styles.clientInfo}>Location: {trainerDetails.location}</Text>
              <Text style={styles.clientInfo}>Based at: {trainerDetails.gymLocation}</Text>
            </View>
          </View>

        {/* About Section */}

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionContent}>{trainerDetails.bio}</Text>

          <View style={styles.goalsAvailabilityFrame}>
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoValue}>4.9</Text>
              <Text style={styles.infoLabel}>Rating</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoValue}>{trainerDetails.experience || 'N/A'}+</Text>
              <Text style={styles.infoLabel}>Years exp.</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoValue}>26</Text>
              <Text style={styles.infoLabel}>Reviews</Text>
            </View>
          </View>
          </View>


        {/* Photos Section */}

          <View style={styles.goalsAvailabilityFrame}>
          <Text style={styles.photosHeadingText}>Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
            {
              trainerResultPhotos.length > 0
                  ? trainerResultPhotos.map((photoUrl, index) => (
                      <Image key={index} source={{ uri: photoUrl }} style={styles.photo} />
                  ))
                  : <Text>No result photos</Text>
            }
          </ScrollView>
        {/* </View> */}

        {/* Specialities and Qualifications */}

          <View style={[styles.section, { marginTop: 5 }]}>
            <Text style={styles.sectionTitle}>Training Style/Specialities</Text>
            <Text style={styles.sectionContent}> ✅{getTrainerSpecialtyLabel(trainerDetails.niche)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Qualifications</Text>
            <Text style={styles.sectionContent}>{Education[trainerDetails.education as keyof typeof Education] || trainerDetails.education}</Text>
          </View>

          {/* Availability Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <Text style={styles.sectionContent}>{formatAvailability(trainerDetails.availability)}</Text>
          </View>
        </View>
        </View>

        {/* Testimonials Section */}
        <Text style={styles.outerTitle}>Testimonials</Text>

        <View style={styles.frame}>
          <Text style={styles.sectionContent}>⭐{trainerDetails.testimonial}</Text>
        </View>

        {/* Select Trainer Button */}
        <TouchableOpacity style={styles.selectButtonWrapper} onPress={() => handleSelectTrainer()} >
          <LinearGradient
            colors={['#4B84C4', '#77C4C6']}
            start={{ x: 0.0256, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.selectButton}
          >
            <Text style={styles.selectButtonText}>Select {trainerDetails.name}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  section: {
    marginTop: 20,
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  goalItem: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666666',
  },
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Puts space between name and edit button
    marginBottom: 10,
  },
  frame: {
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(218, 221, 243, 0.5)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    borderRadius: 14,
    padding: 20,
    marginTop:"auto",
    // marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
  },
  goalsAvailabilityFrame: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 20,
  },
  clientInfoContainer: {
    flex: 1,
  },
  clientName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clientInfo: {
    fontSize: 14,
    color: '#666666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  outerTitle:{
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -15 ,
    padding: 25,
  },
  sectionContent: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoBox: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F4F6F9',
    borderRadius: 10,
    width: '30%',
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
  },
  photosHeadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  photosContainer: {
    flexDirection: 'row',
    marginBottom:10
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  selectButtonWrapper: {
    marginVertical: 20,
  },
  selectButton: {
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});