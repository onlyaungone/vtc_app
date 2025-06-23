import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { WorkoutItem } from '@/constants/workout_types';
import {
  DynamoDBClient,
  ScanCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import {Ionicons} from "@expo/vector-icons";

export default function WorkoutListScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const REGION = process.env.EXPO_PUBLIC_AWS_REGION!;
  const ACCESS_KEY = process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID!;
  const SECRET_KEY = process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY!;
  const TABLE_NAME = 'Workout-ycmuiolpezdtdkkxmiwibhh6e4-staging';

  const client = new DynamoDBClient({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const command = new ScanCommand({ TableName: TABLE_NAME });
      const data = await client.send(command);

      const items = (data.Items || [])
        .map((item) => ({
          id: item.id?.S || '',
          name: item.name?.S || '',
        }))
        .filter((w) => w.id && w.name);

      setWorkouts(items);
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      await client.send(
        new DeleteItemCommand({
          TableName: TABLE_NAME,
          Key: { id: { S: id } },
        })
      );
      Alert.alert('Deleted', 'Workout deleted successfully.');
      fetchExercises();
    } catch (error) {
      console.error('Delete failed:', error);
      Alert.alert('Error', 'Failed to delete workout.');
    }
  };

  const handleWorkoutPress = (workout: WorkoutItem) => {
    if (!workout.id || !workout.name) {
      Alert.alert('Invalid workout', 'Workout data is missing.');
      return;
    }

    router.push({
      pathname: '/screen/Workout/WorkoutDetail',
      params: {
        workoutId: workout.id,
        workoutName: workout.name,
      },
    });
  };


  const goToCreateWorkoutPage = () => {
    router.push('/screen/Workout/createWorkout');

  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Workout List',
          headerBackVisible: false,
          headerTransparent: true,
          headerTintColor: '#4B84C4',
          headerLeft: () => (
              <TouchableOpacity onPress={() => router.push('/trainerHome/home-screen')}>
                <Ionicons name="arrow-back-circle-outline" size={28} color="#4B84C4" />
              </TouchableOpacity>
          ),
        }}
      />

      <TextInput
        style={styles.searchInput}
        placeholder="Search workout..."
        placeholderTextColor="#A0A0A0"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#3777F3" style={{ marginTop: 30 }} />
      ) : filteredWorkouts.length === 0 ? (
        <Text style={styles.noResultsText}>No workouts found</Text>
      ) : (
        <FlatList
          data={filteredWorkouts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.scrollItem}>
              <TouchableOpacity
                style={styles.workoutTouchable}
                onPress={() => handleWorkoutPress(item)}
              >
                <Text style={styles.scrollItemText} numberOfLines={1}>
                  {item.name}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButtonContainer}
                onPress={() => deleteWorkout(item.id)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

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
    marginVertical: 30,
  },
  scrollItem: {
    backgroundColor: '#E0F7FA',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutTouchable: {
    flex: 1,
    paddingRight: 10,
  },
  scrollItemText: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    color: '#00796B',
    fontWeight: 'bold',
    flexShrink: 1,
  },
  deleteButtonContainer: {
    width: 60,
    alignItems: 'flex-end',
  },
  deleteText: {
    color: 'red',
    // fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#A0A0A0',
    fontFamily: 'Josefin Sans',
    fontSize: 16,
    marginTop: 20,
  },
  createButton: {
    backgroundColor: '#3777F3',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  createButtonText: {
    color: 'white',
    fontFamily: 'Josefin Sans',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
