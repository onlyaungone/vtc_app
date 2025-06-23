import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {getUrl} from "aws-amplify/storage";

export default function PackageCreated() {
  const router = useRouter();
  const { trainerId, trainerName, trainerImage, trainerNiche, trainerEmail } = useLocalSearchParams();

  const [presignedUrl, setPresignedUrl] = useState<string | null>(null)

  // Ensure image is a string and handle potential array of images
  const imageUri = Array.isArray(trainerImage) ? trainerImage[0] : trainerImage;

  const getImage = async () => {
    if (imageUri) {
      const preSignedUrlData = await getUrl({
        path: imageUri,
        options: {
          validateObjectExistence: true
        },
      });
      setPresignedUrl(preSignedUrlData.url.toString());
    }
  }

  useEffect(() => {
    getImage()
    console.log(imageUri)
  }, []);

  const goToPaymentFrequency = (packageType: string, price: number) => {
    router.push({
      pathname: '/screen/Payment/packagePricing',
      params: {
        trainerId,
        trainerName,
        trainerImage,
        trainerNiche,
        trainerEmail,
        packageType,
        price: price.toString(),
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
        }}
      />

      <Text style={styles.heading}>Choose a Package</Text>

      {/* Trainer Card */}
      <View style={styles.trainerCard}>
        <Image source={presignedUrl != null ? { uri: presignedUrl } : require('@/assets/images/profile.png')} style={styles.trainerImage} />
        <View style={styles.trainerDetails}>
          <Text style={styles.trainerName}>{trainerName}</Text>
          <Text style={styles.trainerNiche}>{trainerNiche}</Text>
        </View>
      </View>

      {/* Package Options */}
      <Text style={styles.subheading}>Available Packages</Text>

      <Pressable style={styles.packageCard} onPress={() => goToPaymentFrequency('Regular', 100)}>
        <Text style={styles.packageTitle}>🏋️‍♂️ Regular Package</Text>
        <Text style={styles.packagePrice}>$100 / one-time</Text>
        <Text style={styles.packageFeature}>✔ Personalized workouts</Text>
        <Text style={styles.packageFeature}>✔ Progress tracking</Text>
        <Text style={styles.packageFeature}>✔ Weekly email check-ins</Text>
      </Pressable>

      <Pressable style={[styles.packageCard, styles.advancedCard]} onPress={() => goToPaymentFrequency('Advanced', 150)}>
        <Text style={styles.packageTitle}>🔥 Advanced Package</Text>
        <Text style={styles.packagePrice}>$150 / one-time</Text>
        <Text style={styles.packageFeature}>✔ Everything in Regular</Text>
        <Text style={styles.packageFeature}>✔ 1-on-1 Chat with Trainer</Text>
        <Text style={styles.packageFeature}>✔ Monthly video consultations</Text>
        <Text style={styles.packageFeature}>✔ Nutrition guidance</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  subheading: {
    fontSize: 22,
    fontWeight: '600',
    color: '#4B84C4',
    marginBottom: 10,
    marginTop: 20,
  },
  trainerCard: {
    flexDirection: 'row',
    backgroundColor: '#F4F6F9',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  trainerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    marginRight: 15,
  },
  trainerDetails: {
    flexDirection: 'column',
  },
  trainerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  trainerNiche: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  packageCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  advancedCard: {
    backgroundColor: '#E6F2FF',
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3E50',
    marginBottom: 10,
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#4B84C4',
  },
  packageFeature: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
});
