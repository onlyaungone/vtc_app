import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { getCurrentUser } from 'aws-amplify/auth';
import { useAuth } from '@/context/AuthContext'; // ✅ use context

const ProgramWorkoutSelection = () => {
  const router = useRouter();
  const { dynamoClient } = useAuth(); // ✅ shared client
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkouts, setSelectedWorkouts] = useState<any[]>([]);
  const { programName } = useLocalSearchParams();

  const TABLEWORKOUT = 'Workout-ycmuiolpezdtdkkxmiwibhh6e4-staging';
  const EXERCISEWORKOUTTABLE = 'ExercisesWorkout-ycmuiolpezdtdkkxmiwibhh6e4-staging';

  // Fetch workouts and exercises
  const fetchWorkouts = async () => {
    try {
      const user = await getCurrentUser();
      const userSub = user.userId;

      // Step 1: Workouts
      const workoutData = await dynamoClient.send(new ScanCommand({ TableName: TABLEWORKOUT }));
      const workoutItems =
        workoutData.Items?.map((item) => ({
          id: item.id?.S,
          name: item.name?.S,
          image: item.image?.S ? { uri: item.image.S } : require('@/assets/images/WorkoutList.png'),
          userSubId: item.userSubId?.S,
        })) || [];

      const userWorkouts = workoutItems.filter((w) => w.userSubId === userSub);

      // Step 2: Exercises
      const exerciseData = await dynamoClient.send(new ScanCommand({ TableName: EXERCISEWORKOUTTABLE }));
      const exerciseMap: Record<string, { exerciseIds: string[]; workoutExerciseIds: string[] }> = {};

      exerciseData.Items?.forEach((item) => {
        const workoutId = item.workoutId?.S;
        const exerciseId = item.exercisesId?.S;
        const workoutExerciseId = item.id?.S;

        if (workoutId && exerciseId && workoutExerciseId) {
          if (!exerciseMap[workoutId]) {
            exerciseMap[workoutId] = { exerciseIds: [], workoutExerciseIds: [] };
          }
          exerciseMap[workoutId].exerciseIds.push(exerciseId);
          exerciseMap[workoutId].workoutExerciseIds.push(workoutExerciseId);
        }
      });

      // Combine data
      const enrichedWorkouts = userWorkouts.map((workout) => ({
        ...workout,
        exerciseIds: exerciseMap[workout.id ?? '']?.exerciseIds || [],
        workoutExerciseIds: exerciseMap[workout.id ?? '']?.workoutExerciseIds || [],
        exerciseCount: exerciseMap[workout.id ?? '']?.exerciseIds.length || 0,
      }));

      setWorkouts(enrichedWorkouts);
    } catch (error) {
      console.error('Error fetching workouts/exercises:', error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    setFilteredWorkouts(workouts);
  }, [workouts]);

  const toggleSelectWorkout = (item: any) => {
    setSelectedWorkouts((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  const isSelected = (id: string) => selectedWorkouts.some((i) => i.id === id);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredWorkouts(workouts);
    } else {
      const filtered = workouts.filter((w) =>
        w.name.toLowerCase().includes(query.toLowerCase())
      );
      const sorted = filtered.sort(
        (a, b) =>
          a.name.toLowerCase().indexOf(query.toLowerCase()) -
          b.name.toLowerCase().indexOf(query.toLowerCase())
      );
      setFilteredWorkouts(sorted);
    }
  };

  const renderWorkoutItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.workoutContainer} onPress={() => toggleSelectWorkout(item)}>
      <Image source={item.image} style={styles.workoutImage} />
      <View style={styles.workoutDetails}>
        <Text style={styles.workoutName}>{item.name}</Text>
        <Text style={styles.workoutInfo}>Exercise: {item.exerciseCount}</Text>
      </View>
      <View style={styles.dotContainer}>
        {isSelected(item.id) ? (
          <Ionicons name="checkmark-circle" size={24} color="#4B84C4" />
        ) : (
          <Ionicons name="ellipse-outline" size={24} color="#E0E0E0" />
        )}
      </View>
    </TouchableOpacity>
  );

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Workouts</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Search workouts, programs & packages"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredWorkouts}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        renderItem={renderWorkoutItem}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          router.push({
            pathname: '/screen/Program/ProgramDetail',
            params: {
              selected: JSON.stringify(selectedWorkouts),
              programName: programName?.toString(),
            },
          })
        }
      >
        <LinearGradient colors={['#4B84C4', '#77C4C6']} style={styles.gradientButton}>
          <Text style={styles.buttonText}>Add selected workouts</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#333', marginLeft: 10 },
  searchBar: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    color: '#333',
    elevation: 2,
  },
  listContainer: { paddingBottom: 20 },
  workoutContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  workoutImage: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
  workoutDetails: { flex: 1, justifyContent: 'center' },
  workoutName: { fontSize: 18, color: '#333', marginBottom: 5 },
  workoutInfo: { fontSize: 14, color: '#777' },
  dotContainer: { justifyContent: 'center' },
  addButton: { marginTop: 'auto', marginBottom: 30 },
  gradientButton: { paddingVertical: 15, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' },
});

export default ProgramWorkoutSelection;
