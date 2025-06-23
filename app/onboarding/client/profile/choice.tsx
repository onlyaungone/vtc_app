import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { Formik } from 'formik';

import { ClientChoiceSchema } from '@/schemas/onboarding/client';

export default function FitnessProfessional() {
  const router = useRouter();
  const { gender} = useLocalSearchParams();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleContinue = async (values: { selectedOption: string | null }) => {
    if (values.selectedOption === 'yes') {
      router.push({
        pathname: '/onboarding/client/profile/info',
        params: { gender: gender }, // Passing gender as a parameter
      });
    } else if (values.selectedOption === 'no') {
      router.push('/clientHome/home');
    }
  };

  return (
    <Formik
      initialValues={{ selectedOption: null }}
      validationSchema={ClientChoiceSchema}
      onSubmit={handleContinue}
    >
      {({ handleSubmit, setFieldValue, errors }) => (
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
          <Text style={styles.heading}>Are you looking for a trainer right now?</Text>

          <View style={styles.optionContainer}>
            <Pressable
              style={selectedOption === 'yes' ? styles.selectedButton : styles.buttonSecondary}
              onPress={async () => {
                setSelectedOption('yes');
                await setFieldValue('selectedOption', 'yes');
              }}
            >
              {selectedOption === 'yes' ? (
                <LinearGradient
                  colors={['#4B84C4', '#77C4C6']}
                  start={{ x: 0.0, y: 0.5 }}
                  end={{ x: 1.0, y: 0.5 }}
                  style={styles.selectedButton}
                >
                  <Text style={[styles.buttonText, styles.selectedButtonText]}>Yes</Text>
                </LinearGradient>
              ) : (
                <Text style={styles.buttonText}>Yes</Text>
              )}
            </Pressable>
            <Text style={styles.subText}>help me find a PT or coach</Text>
          </View>

          <View style={styles.optionContainer}>
            <Pressable
              style={selectedOption === 'no' ? styles.selectedButton : styles.buttonSecondary}
              onPress={async () => {
                setSelectedOption('no');
                await setFieldValue('selectedOption', 'no');
              }}
            >
              {selectedOption === 'no' ? (
                <LinearGradient
                  colors={['#4B84C4', '#77C4C6']}
                  start={{ x: 0.0, y: 0.5 }}
                  end={{ x: 1.0, y: 0.5 }}
                  style={styles.selectedButton}
                >
                  <Text style={[styles.buttonText, styles.selectedButtonText]}>No</Text>
                </LinearGradient>
              ) : (
                <Text style={styles.buttonText}>No</Text>
              )}
            </Pressable>
            <Text style={styles.subText}>let me look around a lil first</Text>
          </View>

          <Pressable style={styles.actionButton} onPress={() =>handleSubmit()}>
            <Text style={styles.actionButtonText}>Continue</Text>
          </Pressable>

          {errors.selectedOption && <Text style={styles.errorText}>{errors.selectedOption}</Text>}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  heading: {
    fontSize: 33,
    lineHeight: 35,
    textAlign: 'center',
    // letterSpacing: -0.379259,
    color: '#464646',
    marginTop:"auto",
    marginVertical: 20,
  },
  optionContainer: {
    alignItems: 'center',
    marginVertical: 80, // Space between each option and its subtext
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  selectedButton: {
    width: 183,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonSecondary: {
    width: 190,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(168, 168, 168, 0.69)',
    borderRadius: 30,
  },
  buttonText: {
    color: '#A8A8A8',
    fontSize: 26,
    fontWeight: '400',
    lineHeight: 28,
    textAlign: 'center',
    letterSpacing: -0.18801,
  },
  selectedButtonText: {
    color: '#FFFFFF', // Change to white when selected
  },
  subText: {
    fontSize: 20,
    lineHeight: 22,
    textAlign: 'center',
    // letterSpacing: -0.379259,
    color: '#464646',
    opacity: 0.6,
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#4B84C4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});

