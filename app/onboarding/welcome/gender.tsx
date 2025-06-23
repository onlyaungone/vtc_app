import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Dimensions } from 'react-native';

const WIDTH = Dimensions.get('window').width;

export default function WelcomeGender() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
  };

  useEffect(() => {
    if (selectedGender != null) {
      handleContinue()
    }
  }, [selectedGender])

  const handleContinue = () => {
    if (selectedGender) {
      router.push({
        pathname: '/onboarding/welcome/role',
        params: { gender: selectedGender },
      });
    } else {
      alert('Please select a gender');
    }
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

      {/* Title and Subheading */}
      <Text style={styles.headingText}>Select Gender</Text>
      <Text style={styles.subHeading}>Please select your gender!</Text>

      {/* Gender Options */}
      <View style={styles.horizontalContainer}>
        {/* Male Option */}
        <TouchableOpacity onPress={() => handleGenderSelect('Male')}>
          <View
            style={[
              styles.genderOption,
              selectedGender === 'Male' && styles.selectedOption,
            ]}
          >
            <MaterialCommunityIcons
              name="gender-male"
              size={60}
              color={selectedGender === 'Male' ? '#4B84C4' : '#A8A8A8'}
            />
            <Text
              style={[
                styles.genderText,
                { color: selectedGender === 'Male' ? '#4B84C4' : '#A8A8A8' },
              ]}
            >
              Male
            </Text>
          </View>
        </TouchableOpacity>

        {/* Female Option */}
        <TouchableOpacity onPress={() => handleGenderSelect('Female')}>
          <View
            style={[
              styles.genderOption,
              selectedGender === 'Female' && styles.selectedOption,
            ]}
          >
            <MaterialCommunityIcons
              name="gender-female"
              size={60}
              color={selectedGender === 'Female' ? '#4B84C4' : '#A8A8A8'}
            />
            <Text
              style={[
                styles.genderText,
                { color: selectedGender === 'Female' ? '#4B84C4' : '#A8A8A8' },
              ]}
            >
              Female
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Continue and I'd rather not say */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity onPress={() => handleGenderSelect("other")}>
          <Text style={styles.linkText}>I'd rather not say!</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleContinue}>
          <LinearGradient
            colors={['#4B84C4', '#77C4C6']}
            style={styles.continueButton}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    // paddingHorizontal: 20,
    paddingBottom:30,
  },
  headingText: {
    fontSize: 25,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  subHeading: {
    fontSize: 20,
    fontFamily: 'Josefin Sans',
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  genderOption: {
    width: WIDTH * 0.4,
    height: WIDTH * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  selectedOption: {
    borderColor: '#4B84C4',
    borderWidth: 2,
    backgroundColor: '#E7F0F8',
  },
  genderText: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 30,
    width: WIDTH * 0.85,
    alignItems: 'center',
    marginBottom: 10,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Josefin Sans',
    color: '#777',
    marginBottom: 20,
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