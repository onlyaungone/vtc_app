import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';


const { width, height } = Dimensions.get('window');

const ClientReview = () => {
  const router = useRouter();
  const { gender } = useLocalSearchParams(); // Get parameters passed from previous screen

  const navigateToFitnessProfessional = () => {
    router.push({
      pathname: '/onboarding/client/profile/choice',
      params: { gender: gender }, // Passing gender as a parameter
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

      <View style={styles.textContainer}>
        <Text style={styles.mainQuote}>“this app helps me track everything”</Text>
        <Text style={styles.secondaryQuote}>
          & now i or my clients can't live without it!
        </Text>
      </View>

      <Pressable style={styles.actionButton} onPress={navigateToFitnessProfessional}>
        <Text style={styles.actionButtonText}>Continue</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: '100%',
    backgroundColor: '#4B84C4',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop:"auto",
    paddingVertical: 30,
  },
  backButton: {
    position: 'absolute',
    width: 32,
    height: 32,
    left: 15,
    top: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#000000',
    fontSize: 24,
  },
  textContainer: {
    width: (width * 280) / 375,
    height: (height * 200) / 812,
    marginTop: (height * 150) / 812,
    backgroundColor: '#D9D9D9',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  mainQuote: {
    // fontFamily: 'Josefin Sans',
    // fontStyle: 'normal',
    // fontWeight: '500',
    fontSize: 30,
    lineHeight: 35,
    textAlign: 'center',
    letterSpacing: -0.379259,
    color: '#000000',
    marginBottom: 50,
  },
  secondaryQuote: {
    // fontFamily: 'Josefin Sans',
    // fontStyle: 'normal',
    // fontWeight: '300',
    fontSize: 24,
    lineHeight: 23,
    textAlign: 'center',
    letterSpacing: -0.379259,
    color: '#000000',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#000000',
    alignItems: 'center',
    width: '80%',
    marginTop: 'auto',
  },
  actionButtonText: {
    fontSize: 24,
    lineHeight: 28,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default ClientReview;