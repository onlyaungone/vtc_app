import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { Stack, useRouter } from 'expo-router';

export default function TrainingStyle() {
  const router = useRouter();

  const handleOnlinePress = () => {
    router.push('/onboarding/trainer/about-you');
  };

  const handleInPersonPress = () => {
    router.push('/onboarding/trainer/location');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Training Style',
          headerBackVisible: false,
          headerTransparent: true,
          headerTintColor: '#D9D9D9',
        }}
      />

      <Text style={styles.headline}>Training Style</Text>
      <Text style={styles.subheadline}>How do you want to train your clients?</Text>

      <Pressable style={styles.buttonOnline} onPress={handleOnlinePress}>
        <Text style={styles.buttonText}>Online</Text>
      </Pressable>

      <Pressable style={styles.buttonInPerson} onPress={handleInPersonPress}>
        <Text style={styles.buttonText}>In Person</Text>
      </Pressable>

      {/* In case of both, handle as a non-online trainer */}
      <Pressable onPress={handleInPersonPress}>
        <Text style={styles.footerText}>I do both!</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headline: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 20,
  },
  subheadline: {
    fontSize: 16,
    textAlign: 'center',
    color: '#7F7F7F',
    marginBottom: 40,
  },
  buttonOnline: {
    backgroundColor: '#4B84C4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonInPerson: {
    backgroundColor: '#A3DFD2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 16,
    color: '#BFBFBF',
    marginTop: 20,
  },
});
