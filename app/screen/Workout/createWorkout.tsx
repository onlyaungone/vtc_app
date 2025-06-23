import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const CreateWorkoutScreen: React.FC = () => {
  const router = useRouter();
  const [workoutName, setWorkoutName] = useState('');

  const handleContinue = () => {
    if (workoutName.trim()) {
      const param = { workoutName };
      router.push({
        pathname: '/screen/Workout/WorkoutCreateDetail',
        params: param,
      });
    } else {
      alert('Please enter a workout name.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/screen/Workout/WorkoutList')}>
            <Ionicons name="arrow-back-circle-outline" size={28} color="#4B84C4" />
            <Text>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Workout</Text>
        </View>

        {/* Workout Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Workout Name</Text>
          <TextInput
            style={styles.input}
            placeholder="eg. Upper 1"
            value={workoutName}
            onChangeText={setWorkoutName}
          />
        </View>

        {/* Continue Button with Gradient */}
        <TouchableOpacity onPress={handleContinue} style={styles.buttonContainer}>
          <LinearGradient
            colors={['#4B84C4', '#77C4C6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  circleBackground: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#333',
  },
  inputContainer: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 30,
  },
  gradientButton: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CreateWorkoutScreen;
