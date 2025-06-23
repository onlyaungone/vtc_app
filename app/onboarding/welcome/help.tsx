import React, { useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const WIDTH = Dimensions.get('window').width;

export default function WelcomeHelp() {
  const router = useRouter();

  // State variables to control visibility of info containers
  const [showInfo, setShowInfo] = useState({ matching: false, training: false, community: false });

  const toggleInfo = (type: string) => {
    // Toggle the state for each specific info type
    setShowInfo((prev) => ({
      matching: type === 'matching' ? !prev.matching : false,
      training: type === 'training' ? !prev.training : false,
      community: type === 'community' ? !prev.community : false,
    }));
  };

  const handleContinue = () => {
    router.push('/onboarding/welcome/get-started');
  };

  return (
    <LinearGradient
      colors={['#4B84C4', '#77C4C6']}
      start={{ x: 0.2, y: 0.2 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
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

        {/* Main Title */}
        <Text style={styles.headingText}>
          Here is how we can help transform your fitness journey!
        </Text>

        {/* Matching & Finding */}
        <View style={styles.optionContainer}>
          <View style={styles.optionInnerContainer}>
            <Text style={styles.optionText}>Matching & Finding</Text>
            <TouchableOpacity onPress={() => toggleInfo('matching')}>
              <MaterialCommunityIcons
                name="information-outline"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
          {showInfo.matching && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>Find the perfect trainer or workout buddy based on your goals and preferences.</Text>
            </View>
          )}
        </View>

        {/* Training & Nutrition */}
        <View style={styles.optionContainer}>
          <View style={styles.optionInnerContainer}>
            <Text style={styles.optionText}>Training & Nutrition</Text>
            <TouchableOpacity onPress={() => toggleInfo('training')}>
              <MaterialCommunityIcons
                name="information-outline"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
          {showInfo.training && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>Access personalized workout plans and nutrition guidance from experts.</Text>
            </View>
          )}
        </View>

        {/* Community & Education */}
        <View style={[styles.optionContainer, styles.lastOption]}>
          <View style={styles.optionInnerContainer}>
            <Text style={styles.optionText}>Community & Education</Text>
            <TouchableOpacity onPress={() => toggleInfo('community')}>
              <MaterialCommunityIcons
                name="information-outline"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
          {showInfo.community && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>Connect with like-minded individuals, join fitness challenges, and learn about health and wellness.</Text>
            </View>
          )}
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleContinue}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Continue</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  headingText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 40,
    fontFamily: 'Josefin Sans',
  },
  optionContainer: {
    width: 390,
    height: 129,
    marginVertical: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  lastOption: {
    marginBottom: 80,
  },
  optionInnerContainer: {
    flexDirection: 'row',// Centering the text horizontally
    alignItems: 'center',
    width: '90%',
  },
  optionText: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Josefin Sans',
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    left: 20,
    top: 690,
    width: WIDTH * 0.85,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    width: WIDTH * 0.85,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    fontSize: 18,
  },
});