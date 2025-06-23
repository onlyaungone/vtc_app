// app/onboarding/trainer/submit.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { useActiveUserStore } from '@/hooks/useActiveUser';
import { getUrl } from 'aws-amplify/storage';

export default function Submit() {
  const router = useRouter();
  const { activeUser } = useActiveUserStore();
  const [profileImage, setProfileImage] = useState<string>('');

  // ───────────────────────────────────────────
  // 1️⃣ Declare ALL hooks at the top, unconditionally.
  // ───────────────────────────────────────────
  useEffect(() => {
    // Only fetch if activeUser is non-null
    if (activeUser && activeUser.image) {
      getUrl({
        path: activeUser.image,
        options: { validateObjectExistence: true },
      })
        .then((res) => {
          setProfileImage(res.url.toString());
        })
        .catch((err) => {
          console.warn('Failed to load profile image:', err);
        });
    }
  }, [activeUser]);

  // If there’s no activeUser yet, render a loading indicator
  // (hooks above still ran, so React’s hook count is consistent).
  if (!activeUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3777F3" />
      </View>
    );
  }

  // ───────────────────────────────────────────
  // 2️⃣ At this point, activeUser is guaranteed to be non-null,
  //    so it’s safe to read activeUser.name, activeUser.image, etc.
  // ───────────────────────────────────────────
  const goToTrainerHome = () => {
    router.push('/trainerHome/home-screen');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Text style={styles.headline}>Profile submitted</Text>
      <Text style={styles.subheadline}>You submitted:</Text>

      <View style={styles.profileContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          // Placeholder circle until image loads
          <View style={styles.placeholderImage} />
        )}
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>{activeUser.name}</Text>
          <Text style={styles.profileAge}>Age: {activeUser.age}</Text>
          <Text style={styles.profileQuote}>{activeUser.bio}</Text>
        </View>
      </View>

      <Text style={styles.infoText}>
        Your profile has been submitted. Our team will be in touch shortly to
        confirm your details and approve you to utilise our platform.
      </Text>

      <Pressable style={styles.homeButton} onPress={goToTrainerHome}>
        <Text style={styles.homeButtonText}>Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
  },
  headline: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    fontFamily: 'Josefin Sans',
  },
  subheadline: {
    fontSize: 16,
    color: '#A9A9A9',
    marginBottom: 20,
    fontFamily: 'Josefin Sans',
  },
  profileContainer: {
    flexDirection: 'row',
    backgroundColor: '#F4F6F9',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: '#DDD',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Josefin Sans',
  },
  profileAge: {
    fontSize: 16,
    color: '#333333',
    marginTop: 5,
    fontFamily: 'Josefin Sans',
  },
  profileQuote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333333',
    marginTop: 5,
    fontFamily: 'Josefin Sans',
  },
  infoText: {
    fontSize: 16,
    color: '#A9A9A9',
    marginBottom: 40,
    fontFamily: 'Josefin Sans',
  },
  homeButton: {
    backgroundColor: '#4B84C4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  homeButtonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Josefin Sans',
  },
});
