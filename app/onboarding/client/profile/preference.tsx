import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';

const TrainingTypeSelection = () => {
  const router = useRouter();
  const { age, goals, availableDays, gender, bio} = useLocalSearchParams();
  const para = {
    age: age,
    goals: goals,
    availableDays: availableDays,
    gender: gender,
    bio: bio
  };
  const handleInPersonPress = () => {

    console.log("inperson")
    router.push({
      pathname: '/onboarding/client/inPerson/location',
      params: para
    });
  };

  const handleOnlinePress = () => {
    router.push({pathname: '/onboarding/client/online/availability',
      params: para
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
            options={{
              headerShown: true,
              headerTitle: "",
              headerBackVisible: false,
              headerTransparent: true,
              headerTintColor: "#D9D9D9",
            }}
          />


      <Text style={styles.heading}>Training Style</Text>
      <Text style={styles.title}>How do you want to train with your trainer?</Text>
      <Pressable style={styles.buttonPrimary} onPress={handleOnlinePress}>
        <Text style={styles.buttonOText}>Online</Text>
      </Pressable>

      <Pressable style={styles.buttonSecondary} onPress={handleInPersonPress}>
        <Text style={styles.buttonPText}>In Person</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    width: 32,
    height: 32,
    left: 20,
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#000000',
    fontSize: 24,
  },
  heading: {
    fontFamily: 'Josefin Sans',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 42,
    lineHeight: 50,
    letterSpacing: -0.32,
    color: '#000000',
    textAlign: 'center',
    marginTop: -50,
    marginBottom: 20,

  },
  title: {
    fontFamily: 'Josefin Sans',
    fontStyle: 'normal',
    fontWeight: '500',
    alignItems: 'center',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.32,
    color: '#9B9B9B',
    textAlign: 'center',
    marginBottom: 20,

  },
  buttonPrimary: {
    width: '90%',
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4B84C4',
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonSecondary: {
    width: '90%',
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CFEEF0',
    borderRadius: 30,
  },
  buttonOText: {
    fontFamily: 'Josefin Sans',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.18801,
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 0,
    flexGrow: 0,
  },
  buttonPText: {
    fontFamily: 'Josefin Sans',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.18801,
    color: '#0EB7C2',
    textAlign: 'center',
    flex: 0,
    flexGrow: 0,
  },

});


export default TrainingTypeSelection;