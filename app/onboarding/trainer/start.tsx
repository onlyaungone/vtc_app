import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import {Stack, useLocalSearchParams, useRouter} from 'expo-router';
import {useTrainerOnboardingStore} from "@/hooks/onboarding/useTrainerOnboarding";

export default function Start() {
  const router = useRouter();
  const { gender } = useLocalSearchParams();
  const {setUserGender} = useTrainerOnboardingStore();

  const handleContinue = () => {
    setUserGender(gender as string);
    console.log(gender)
    router.push('/onboarding/trainer/training-style');
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

      <Text style={styles.headline}>Welcome to Trainer Onboarding</Text>
      <Text style={styles.subheadline}>Let's get started!</Text>

      <Pressable style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B84C4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headline: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  subheadline: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    width: '100%',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  },
});
