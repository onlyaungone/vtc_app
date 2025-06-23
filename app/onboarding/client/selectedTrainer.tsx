import React, {useEffect, useState} from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import {getUrl} from "aws-amplify/storage";

export default function SelectedTrainer() {
  const router = useRouter();
  const { trainerId, name, image, niche, email } = useLocalSearchParams();
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null)

  // Ensure image is a string and handle potential array of images
  const imageUri = Array.isArray(image) ? image[0] : image;

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

  const goToPackageSelection = () => {
  router.push({
    pathname: '/screen/Payment/packageCreated',
    params: {
      trainerId: trainerId as string,
      trainerName: name as string,
      trainerImage: image as string,
      trainerNiche: niche as string,
      trainerEmail: email as string,
    },
  });
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

      <Text style={styles.heading}>Trainer Selected</Text>
      <Text style={styles.secondHeading}>You selected</Text>

     {/* Trainer Details */}
     <View style={styles.card}>
        <Image source={presignedUrl != null ? { uri: presignedUrl } : require('@/assets/images/profile.png')} style={styles.profileImage} />
        <View style={styles.cardContent}>
          <Text style={styles.trainerName}>{name}</Text>
          <Text style={styles.trainerSpecialty}>{niche}</Text>

        </View>
      </View>

      <Text style={styles.secondHeading}> {name} will be in touch with you soon to discuss working together and how you can smash your goals!</Text>

      <Pressable style={styles.continueButton} onPress={goToPackageSelection}>
        <Text style={styles.buttonText}>View Trainer Packages</Text>
      </Pressable>

      <Pressable style={styles.homeButton} onPress={() => router.push('/clientHome/home')}>
        <Text style={styles.secondaryButtonText}>Continue to Home</Text>
      </Pressable>

      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
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
    width: '100%',
    height: 120,
    marginLeft: 5,
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
    backgroundColor: 'white',
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
    marginLeft: 20
  },
  trainerSpecialty: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    fontWeight: '400',
    color: '#9B9B9B',
    marginLeft: 20
  },
  continueButton: {
    backgroundColor: "#4B84C4",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 80,
  },
  homeButton: {
    backgroundColor: '#DDDDDD',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
