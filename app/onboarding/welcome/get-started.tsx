import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const WIDTH = Dimensions.get('window').width;

export default function WelcomeGetStarted() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/onboarding/welcome/gender');
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

        {/* Centered Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.headingText}>
            To get started, we just have a couple of quick questions to find what you're looking for!
          </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Josefin Sans',
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 28,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 40,
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