import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Dimensions } from 'react-native';
import {fetchUserAttributes, updateUserAttributes} from 'aws-amplify/auth';

export default function WelcomeTrainerVsTrainee() {
  const router = useRouter();
  const { gender } = useLocalSearchParams();
  const [selectedOption, setSelectedOption] = useState('');

  const goToOnboarding = async () => {
    try {
      const result = await updateUserAttributes(
          {userAttributes: {'custom:role': selectedOption === 'yes' ? 'PT' : 'Client'}});

      const resObject = result["custom:role"]

      if (resObject.nextStep.updateAttributeStep === 'DONE') {
        router.push({
          pathname: selectedOption === 'yes' ? '/onboarding/trainer/start' : '/onboarding/client/profile/start',
          params: {gender: gender},
        });
      }
    } catch (error) {
        if (error instanceof Error) {
          console.log('Error updating user attributes:', error.name);
          console.log('Error updating user attributes:', error.message);
        } else {
          console.log('Error updating user attributes:', error);
        }
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackVisible: false,
          headerTransparent: true,
          headerTintColor: '#D9D9D9',
        }}
      />

      {/* Title and Question */}
      <Text style={styles.title}>Fitness Profession</Text>
      <Text style={styles.subHeading}>Are you a fitness professional?</Text>

      {/* Yes Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            handleOptionSelect('yes');
          }}
        >
          {selectedOption === 'yes' ? (
            <LinearGradient
              colors={['#4B84C4', '#77C4C6']}
              style={styles.optionButtonGradient}
            >
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Yes</Text>
            </LinearGradient>
          ) : (
            <View style={styles.optionButton}>
              <Text style={[styles.buttonText, { color: '#4B84C4' }]}>Yes</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.descriptionText}>I am a personal trainer or online coach</Text>

      {/* No Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            handleOptionSelect('no');
          }}
        >
          {selectedOption === 'no' ? (
            <LinearGradient
              colors={['#4B84C4', '#77C4C6']}
              style={styles.optionButtonGradient}
            >
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>No</Text>
            </LinearGradient>
          ) : (
            <View style={styles.optionButton}>
              <Text style={[styles.buttonText, { color: '#4B84C4' }]}>No</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.descriptionText}>I am not a personal trainer or online coach</Text>

      {/* Continue Button at Bottom */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
            disabled={selectedOption === ''}
            onPress={async () => {
              await goToOnboarding();
            }}
        >
          <LinearGradient colors={['#4B84C4', '#77C4C6']} style={[
              styles.continueButton,
              selectedOption === '' && { opacity: 0.6 }, // Reduce opacity when disabled
            ]}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingBottom:15,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  buttonContainer: {
    marginVertical: 10,
    width: WIDTH * 0.85,
    alignItems: 'center',
  },
  optionButton: {
    width: WIDTH * 0.85,
    paddingVertical: 15,
    borderRadius: 25,
    borderColor: '#4B84C4',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonGradient: {
    width: WIDTH * 0.85,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    alignContent: 'center',
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Josefin Sans',
    textAlign: 'center',
    color: '#777',
    marginBottom: 20,
    marginTop: 10,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 30,
    width: WIDTH * 0.85,
    alignItems: 'center',
    marginBottom: 10,
  },
  continueButton: {
    width: WIDTH * 0.85,
    paddingVertical: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 20,
    fontFamily: 'Josefin Sans',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});