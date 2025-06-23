import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

export default function WorkoutListScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [workouts, setWorkouts] = useState<{ id: string; name: string }[]>([]);

  const router = useRouter();

  const filteredWorkouts = workouts.filter((workout) =>
    workout?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const REGION = process.env.EXPO_PUBLIC_AWS_REGION!;
  const KEY = process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID!;
  const SECRET = process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY!;
  const TABLE = 'Workout-ycmuiolpezdtdkkxmiwibhh6e4-staging';

  const client = new DynamoDBClient({
    region: REGION,
    credentials: {
      accessKeyId: KEY,
      secretAccessKey: SECRET,
    },
  });

  async function fetchExercises() {
    const params = {
      TableName: TABLE,
    };
    const command = new ScanCommand(params);
    const data = await client.send(command);
    const items = data.Items?.map(item => ({
      id: item.id?.S ?? '',
      name: item.name?.S ?? '',
    })) || [];
    setWorkouts(items);
  }

  const handleWorkoutPress = (workout: { id: any; name: any; description?: string }) => {
    router.push({
      pathname: '../screen/workoutpage',
      params: { workoutId: workout.id, workoutName: workout.name }
    });
  };

  const goToCreateWorkoutPage = () => {
    router.push('/screen/Workout/createWorkout');
  };

  useEffect(() => {
    fetchExercises();
  }, []);

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
      <Text style={styles.header}>Workout List</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search workout..."
        placeholderTextColor="#A0A0A0"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <ScrollView style={styles.scrollBar}>
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={styles.scrollItem}
              onPress={() => handleWorkoutPress(workout)}
            >
              <Text style={styles.scrollItemText}>{workout.name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultsText}>No workouts found</Text>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.createButton} onPress={goToCreateWorkoutPage}>
        <Text style={styles.createButtonText}>Create workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 28,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    fontFamily: 'Josefin Sans',
    borderColor: '#ccc',
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  scrollBar: {
    marginBottom: 20,
  },
  scrollItem: {
    backgroundColor: '#E0F7FA',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  scrollItemText: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    color: '#00796B',
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#A0A0A0',
    fontFamily: 'Josefin Sans',
    fontSize: 16,
    marginTop: 10,
  },
  createButton: {
    backgroundColor: '#3777F3',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontFamily: 'Josefin Sans',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
