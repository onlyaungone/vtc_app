import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { getCurrentUser } from 'aws-amplify/auth';

export default function NewProgramScreen() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<string[]>([]);
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        console.log('Current user:', currentUser);
      } catch (error) {
        console.log('No user signed in', error);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleAddWorkout = () => {
    Alert.alert('Add workout', 'Functionality to add a workout here.');
    setWorkouts([...workouts, `Workout ${workouts.length + 1}`]);
  };

  const handleSaveProgram = () => {
    if (!user) {
      Alert.alert('Not Logged In', 'Please log in to save your program.');
      return;
    }

    if (workouts.length === 0) {
      Alert.alert('Error', 'Please add at least one workout before saving.');
      return;
    }

    Alert.alert('Program saved!', `You have saved a program with ${workouts.length} workouts.`);
    router.push('./screen/ProgramsScreen');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerTintColor: '#D9D9D9',
        }}
      />

      <Text style={styles.header}>New Program Title</Text>

      {user ? (
        <Text style={styles.userInfo}>Welcome, {user.username}!</Text>
      ) : (
        <Text style={styles.emptyState}>Please log in to save your program.</Text>
      )}

      {workouts.length === 0 ? (
        <Text style={styles.emptyState}>Nothing here yet...</Text>
      ) : (
        <View style={styles.workoutList}>
          {workouts.map((workout, index) => (
            <Text key={index} style={styles.workoutItem}>
              {workout}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddWorkout}>
        <Text style={styles.addButtonText}>Add Workout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProgram}>
        <Text style={styles.saveButtonText}>Save Program</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  userInfo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  emptyState: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 30,
  },
  workoutList: {
    width: '100%',
    marginBottom: 30,
  },
  workoutItem: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#E0F7FA',
    borderRadius: 10,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#C8F0E7',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 30,
  },
  addButtonText: {
    color: '#2C9C92',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#3777F3',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
