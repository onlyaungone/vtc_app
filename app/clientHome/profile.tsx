import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTrainerOnboardingStore } from '@/hooks/onboarding/useTrainerOnboarding';
import { AttributeValue, DynamoDBClient, ScanCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { getCurrentUser, signOut, fetchUserAttributes } from 'aws-amplify/auth';
import { getUrl, uploadData } from 'aws-amplify/storage';
import { Goal, Days } from '@/schemas/onboarding/client/details';
import { LinearGradient } from 'expo-linear-gradient';
import {useAuth} from "@/context/AuthContext";
import * as ImagePicker from 'expo-image-picker';

export default function Profile() {
  const router = useRouter();
  const {logout} = useAuth()
  const schemaHandler = useTrainerOnboardingStore();

  const [clientName, setClientName] = useState('');
  const [clientAge, setClientAge] = useState(0);
  const [clientGender, setClientGender] = useState('');
  const [clientGLoc, setClientGLoc] = useState('');
  const [clientBio, setClientBio] = useState('');
  const [clientLocation, setClientLocation] = useState('');
  const [goals, setClientGoals] = useState<AttributeValue[] | undefined>(undefined);
  const [clientAvailability, setClientAvailability] = useState<AttributeValue[] | undefined>(undefined);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const TABLE1 = 'InPersonClient-ycmuiolpezdtdkkxmiwibhh6e4-staging';
  const TABLE2 = 'OnlineClient-ycmuiolpezdtdkkxmiwibhh6e4-staging';

  const client = new DynamoDBClient({
    region: process.env.EXPO_PUBLIC_AWS_REGION!,
    credentials: {
      accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
  });

  async function fetchData() {
    try {
      const user = await getCurrentUser();
      const userSub = user.userId || user.username;

      const userAttrs = await fetchUserAttributes();
      const customPictureUrl = userAttrs['custom:profilePicture'];

      if (customPictureUrl) {
        setProfileImage(customPictureUrl);
      }

      const data1 = await client.send(new ScanCommand({ TableName: TABLE1 }));
      const items1 = data1.Items?.map(item => ({
        id: item.id?.S,
        name: item.name?.S,
        age: item.age?.N,
        location: item.location?.S,
        gymLocation: item.gymLocation?.S,
        sub: item.sub?.S,
        gender: item.gender?.S,
        availability: item.availability?.L,
        goals: item.goals?.L,
        bio: item.bio?.S,
        image: item.image?.S,
      }));

      const data2 = await client.send(new ScanCommand({ TableName: TABLE2 }));
      const items2 = data2.Items?.map(item => ({
        id: item.id?.S,
        name: item.name?.S,
        age: item.age?.N,
        sub: item.sub?.S,
        gender: item.gender?.S,
        availability: item.availability?.L,
        goals: item.goals?.L,
        bio: item.bio?.S,
        image: item.image?.S,
      }));

      type UserData = {
        id?: string;
        name?: string;
        age?: string;
        sub?: string;
        gender?: string;
        gymLocation?: string;
        location?: string;
        availability?: AttributeValue[];
        goals?: AttributeValue[];
        bio?: string;
        image?: string;
      };

      const userData: UserData | undefined = items1?.find(el => el.sub === userSub) || items2?.find(el => el.sub === userSub);

      if (userData) {
        setClientName(userData.name || 'Your Name');
        setClientAge(Number(userData.age) || 0);
        setClientGLoc(userData.gymLocation || '');
        setClientBio(userData.bio || '');
        setClientGoals(userData.goals || []);
        setClientLocation(userData.location || '');
        setClientAvailability(userData.availability || []);
        setClientGender(userData.gender || '');

        if (!customPictureUrl && userData.image) {
          try {
            const result = await getUrl({ key: userData.image });
            setProfileImage(result.url.toString());
          } catch (err) {
            console.log('Error fetching fallback S3 image:', err);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  const handleProfileImageUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Media permission is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || result.assets.length === 0) return;

    const imageAsset = result.assets[0];
    const imageBlob = await (await fetch(imageAsset.uri)).blob();

    const user = await getCurrentUser();
    const clientId = user.userId || user.username;
    const s3Key = `clients/profilePics/${clientId}.jpg`;

    try {
      await uploadData({
        key: s3Key,
        data: imageBlob,
        options: { contentType: 'image/jpeg' },
      }).result;

      await client.send(new UpdateItemCommand({
        TableName: TABLE1,
        Key: { id: { S: clientId } },
        UpdateExpression: 'SET #img = :img',
        ExpressionAttributeNames: { '#img': 'image' },
        ExpressionAttributeValues: { ':img': { S: s3Key } },
      }));

      const { url } = await getUrl({ key: s3Key });
      setProfileImage(url.toString());

      alert('Profile picture updated!');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. Try again.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatAvailability = (clientAvailability: Array<AttributeValue> = []) => {
    const availabilityValues = clientAvailability
      .filter((item): item is { S: string } => item && typeof item.S === 'string')
      .map(item => Days[item.S as keyof typeof Days]);

    if (availabilityValues.length === 0) return 'No availability';
    if (availabilityValues.length === 1) return availabilityValues[0];
    return availabilityValues.slice(0, -1).join(', ') + ' and ' + availabilityValues.slice(-1);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.frame}>
        <View style={styles.nameEditRow}>
          <Text style={styles.headerText}>My Profile</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileContainer}>
          <Image
            source={profileImage ? { uri: profileImage } : require('@/assets/images/client1.png')}
            style={styles.profilePic}
          />
          <TouchableOpacity onPress={handleProfileImageUpload}>
            <Text style={{ color: 'blue', marginTop: 5 }}>Change Profile Picture</Text>
          </TouchableOpacity>
          <View style={styles.clientInfoContainer}>
            <Text style={styles.clientName}>{clientName}</Text>
            <Text style={styles.clientInfo}>{clientAge}</Text>
            <Text style={styles.clientInfo}>{clientGender}</Text>
            <Text style={styles.clientInfo}>{clientLocation}</Text>
            <Text style={styles.clientInfo}>Training at: {clientGLoc}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionContent}>{clientBio}</Text>

        <View style={styles.goalsAvailabilityFrame}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Goals</Text>
            {goals?.length ? (
              goals.map((goal, index) => (
                <Text key={index} style={styles.goalItem}>{Goal[goal.S as keyof typeof Goal] || goal.S}</Text>
              ))
            ) : (
              <Text style={styles.goalItem}>No goals available</Text>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <Text style={styles.sectionContent}>{formatAvailability(clientAvailability)}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 10,
    paddingTop: 10,
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
  sectionContent: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  goalItem: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666666',
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
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#FF5252',
    width: "20%",
    justifyContent: 'center',
    paddingVertical: 5,
    borderRadius: 10,
    marginLeft: "auto",
    marginBottom: 20,
  },
  logoutText: {
    color: '#FFF',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});
