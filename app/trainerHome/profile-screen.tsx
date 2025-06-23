
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTrainerOnboardingStore } from '@/hooks/onboarding/useTrainerOnboarding';
import { AttributeValue, DynamoDBClient, ScanCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { getUrl, uploadData } from 'aws-amplify/storage';
import { Days } from "@/schemas/onboarding/client/details";
import { Education } from '@/schemas/onboarding/client/experience';
import { LinearGradient } from 'expo-linear-gradient';
import { getTrainerSpecialtyLabel } from '../onboarding/client/online/match';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';


type GalleryImage = { id: string; src: string };

export default function profile() {
  const router = useRouter();
  const schemaHandler = useTrainerOnboardingStore();
  const {logout} = useAuth();

  const [trainerName, settrainerName] = useState('');
  const [trainerAge, settrainerAge] = useState(0);
  const [trainerGender, settrainerGender] = useState('');
  const [trainerGLoc, settrainerGLoc] = useState('');
  const [trainerBio, settrainerBio] = useState('');
  const [trainerLocation, settrainerLocation] = useState('');
  const [trainerNiche, settrainerNiche] = useState('');
  const [trainerEducation, settrainerEducation] = useState('');
  const [trainerCertifications, setTrainerCertifications] = useState<AttributeValue[] | undefined>(undefined);
  const [trainerAvailability, settrainerAvailability] = useState<AttributeValue[] | undefined>(undefined);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  const REGION = process.env.EXPO_PUBLIC_AWS_REGION!;
  const KEY = process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID!;
  const SECRET = process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY!;
  const TABLE = 'PersonalTrainer-ycmuiolpezdtdkkxmiwibhh6e4-staging';

  const trainer = new DynamoDBClient({
    region: REGION,
    credentials: {
      accessKeyId: KEY,
      secretAccessKey: SECRET,
    },
  });

  useEffect(() => {
    fetchData();
    fetchGalleryImages();
  }, []);

  async function fetchData() {
    const user = await getCurrentUser();
    const userSub = user.userId;

    const command = new ScanCommand({ TableName: TABLE });
    const data = await trainer.send(command);

    const items = data.Items?.map(item => ({
      id: item.id?.S,
      age: item.age?.N,
      bio: item.bio?.S,
      availability: item.availability?.L,
      niche: item.niche?.S,
      education: item.education?.S,
      certification: item.certifications?.L,
      experience: item.experience?.N,
      gender: item.gender?.S,
      gymLocation: item.gymLocation?.S,
      location: item.location?.S,
      isApproved: item.isApproved?.BOOL,
      image: item.image?.S,
      name: item.name?.S,
      sub: item.sub?.S,
    }));

    const found = items?.find(el => el.sub === userSub);
    if (found) {
      settrainerName(found.name || 'Your Name');
      settrainerAge(Number(found.age || 0));
      settrainerGLoc(found.gymLocation || '');
      settrainerBio(found.bio || '');
      settrainerNiche(found.niche || '');
      settrainerEducation(found.education || '');
      setTrainerCertifications(found.certification || []);
      settrainerLocation(found.location || '');
      settrainerAvailability(found.availability || []);
      settrainerGender(found.gender || '');

      if (found.image) {
        try {
          const result = await getUrl({ path: found.image });
          setProfileImage(result.url.toString());
        } catch (error) {
          console.log("Error fetching profile image:", error);
        }
      }
    }
  }

  const fetchGalleryImages = async () => {
    try {
      const user = await getCurrentUser();
      const userSub = user.userId;

      const command = new ScanCommand({ TableName: TABLE });
      const data = await trainer.send(command);
      const found = data.Items?.find((el: any) => el.sub?.S === userSub);
      const photos = found?.resultsPhotos?.L || [];

      const urls = await Promise.all(
        photos.map(async (entry: any, index: number) => {
          const s3Key = entry.S;
          const imgUrl = await getUrl({
            path: s3Key,
            options: {
              validateObjectExistence: true,
            },
          });
          return { id: index.toString(), src: imgUrl.url.toString() };
        })
      );
      setGalleryImages(urls);
    } catch (error) {
      console.error('Error loading gallery images:', error);
    }
  };

  const handleImageUpload = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'You must allow camera roll access.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
      if (result.canceled) return;

      const asset = result.assets[0];
      const blob = await (await fetch(asset.uri)).blob();

      const user = await getCurrentUser();
      const userSub = user.userId;
      const s3Key = `public/trainers/${userSub}/photos/${uuidv4()}.jpg`;

      await uploadData({ path: s3Key, data: blob, options: { contentType: 'image/jpeg' } });

      const scan = await trainer.send(new ScanCommand({ TableName: TABLE }));
      const found = scan.Items?.find((item: any) => item.sub?.S === userSub);

      if (found?.id?.S) {
        const currentPhotos = found.resultsPhotos?.L || [];
        await trainer.send(new UpdateItemCommand({
          TableName: TABLE,
          Key: { id: { S: found.id.S } },
          UpdateExpression: 'SET resultsPhotos = :photos',
          ExpressionAttributeValues: {
            ':photos': {
              L: [...currentPhotos, { S: s3Key }],
            },
          },
        }));
        Alert.alert('Success', 'Photo uploaded!');
        fetchGalleryImages();
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Image upload failed.');
    }
  };

  const formatAvailability = (trainerAvailability: Array<AttributeValue> = []) => {
    const values = trainerAvailability
      .filter((item): item is { S: string } => item && typeof item.S === 'string')
      .map(item => Days[item.S as keyof typeof Days]);

    if (values.length === 0) return 'No availability';
    if (values.length === 1) return values[0];
    return values.slice(0, -1).join(', ') + ' and ' + values.slice(-1);
  };

  const formatCertifications = (certifications: Array<AttributeValue> = []) => {
    const values = certifications
        .filter((item): item is { S: string } => item && typeof item.S === 'string')
        .map(item => item.S);

    if (values.length === 0) return 'No education';
    return values.join('\n');
  };

  const handleLogout = async () => {
   try {
    await logout();
    router.push('/auth/sign-in');
   } catch (err) {
    console.error('Error signing out:', err);
    Alert.alert('Error', 'Could not sign out. Please try again.');
  }
}

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, headerTitle: '', headerBackVisible: false, headerTransparent: true, headerTintColor: '#D9D9D9' }} />

      <View style={styles.frame}>
        <View style={styles.nameEditRow}>
          <Text style={styles.headerText}>My Profile</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profilePic} />
          ) : (
            <Image source={require('@/assets/images/profile.png')} style={styles.profilePic} />
          )}
          <View style={styles.clientInfoContainer}>
            <Pressable>
              <View style={styles.nameEditRow}>
                <Text style={styles.clientName}>{trainerName}</Text>
              </View>
            </Pressable>
            <Text style={styles.clientInfo}>{trainerAge}</Text>
            <Text style={styles.clientInfo}>{trainerGender}</Text>
            <Text style={styles.clientInfo}>{trainerLocation}</Text>
            <Text style={styles.clientInfo}>Training at: {trainerGLoc}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionContent}>{trainerBio}</Text>

        <View style={styles.goalsAvailabilityFrame}>
          <View style={[styles.section, { marginTop: 5 }]}>
            <Text style={styles.sectionTitle}>Training Style/Specialities</Text>
            <Text style={styles.goalItem}>{getTrainerSpecialtyLabel(trainerNiche)}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Qualifications</Text>
            <Text style={styles.sectionContent}>{
              trainerEducation === ''
                  ? formatCertifications(trainerCertifications)
                  : trainerEducation
            }</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <Text style={styles.sectionContent}>{formatAvailability(trainerAvailability)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.frame}>
        <LinearGradient colors={['#4B84C4', '#77C4C6']} start={{ x: 0.0256, y: 0 }} end={{ x: 1, y: 1 }} style={styles.photosHeading}>
          <Text style={styles.photosHeadingText}>Photos</Text>
        </LinearGradient>

        <TouchableOpacity onPress={handleImageUpload} style={styles.uploadButton}>
          <Text style={styles.uploadText}>Upload New Photo</Text>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
          {galleryImages.length > 0 ? (
            galleryImages.map((image) => (
              <Image key={image.id} source={{ uri: image.src }} style={styles.photo} />
            ))
          ) : (
            <Text style={styles.noPhotos}>No photos uploaded yet.</Text>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 10,
    paddingTop: 20,
  },
  section: {
    marginTop: 20,
  },
  frame: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(218, 221, 243, 0.5)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    borderRadius: 14,
    padding: 20,
    marginVertical: 10,
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFF',
    fontWeight: 'bold',
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
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  goalItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  goalsAvailabilityFrame: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    padding: 10,
  },
  photosHeading: {
    width: '50%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'center',
  },
  photosHeadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadButton: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  uploadText: {
    color: '#4B84C4',
    fontWeight: 'bold',
  },
  photosContainer: {
    flexDirection: 'row',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  noPhotos: {
    textAlign: 'center',
    color: '#999',
  },
  nameEditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
