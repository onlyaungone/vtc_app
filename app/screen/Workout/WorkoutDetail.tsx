import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ExerciseDetail } from '@/constants/workout_types';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const WorkoutDetail: React.FC = () => {
  const router = useRouter();
  const { workoutId } = useLocalSearchParams();
  const [exercises, setExercises] = useState<ExerciseDetail[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const REGION = process.env.EXPO_PUBLIC_AWS_REGION!;
  const ACCESS_KEY = process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID!;
  const SECRET_KEY = process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY!;

  const client = new DynamoDBClient({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });

  async function fetchAllItems(tableName: string) {
    let items: any[] = [];
    let ExclusiveStartKey;
    do {
      const response = await client.send(
        new ScanCommand({ TableName: tableName, ExclusiveStartKey })
      );
      items.push(...(response.Items || []));
      ExclusiveStartKey = response.LastEvaluatedKey;
    } while (ExclusiveStartKey);
    return items;
  }

  const fetchExercises = async () => {
    try {
      const [detailItems, exerciseItems, workoutExerciseItems] = await Promise.all([
        fetchAllItems('ExerciseDetails-ycmuiolpezdtdkkxmiwibhh6e4-staging'),
        fetchAllItems('Exercises-ycmuiolpezdtdkkxmiwibhh6e4-staging'),
        fetchAllItems('ExercisesWorkout-ycmuiolpezdtdkkxmiwibhh6e4-staging'),
      ]);

      const linkedWorkoutExercises = workoutExerciseItems
        .filter((item) => item.workoutId?.S?.trim() === workoutId?.toString().trim())
        .sort((a, b) => (a.createdAt?.S ?? '').localeCompare(b.createdAt?.S ?? ''));

      if (linkedWorkoutExercises.length === 0) {
        setExercises([]);
        setHasLoaded(true);
        return;
      }

      const exerciseIdToNameMap: Record<string, string> = {};
      exerciseItems.forEach((item) => {
        const id = item.id?.S?.trim();
        const name = item.name?.S?.trim();
        if (id && name) {
          exerciseIdToNameMap[id] = name;
        }
      });

      const combined: ExerciseDetail[] = linkedWorkoutExercises.map((we) => {
        const workoutExerciseId = we.id?.S?.trim() || '';
        const exerciseId = we.exercisesId?.S?.trim() || '';
        const nameFromExercises = exerciseIdToNameMap[exerciseId];
        const nameFromWorkout = we.exerciseName?.S?.trim();
        const name = nameFromExercises || nameFromWorkout || 'Unknown';

        const matchingDetail = detailItems.find(
          (d) => d.workoutExerciseId?.S?.trim() === workoutExerciseId
        );

        return {
          id: matchingDetail?.id?.S || workoutExerciseId,
          workoutExerciseId,
          name,
          set: matchingDetail?.set?.N || '',
          load: matchingDetail?.load?.S || '',
          reps: matchingDetail?.reps?.S || '',
          rest: matchingDetail?.rest?.S || '',
          variable: matchingDetail?.variable?.S || '',
          image: require('@/assets/images/WorkoutExerciseDescription.png'),
        };
      });

      setExercises(combined);
    } catch (error) {
      console.error('Error fetching exercise data:', error);
    } finally {
      setHasLoaded(true);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const renderExerciseSetRow = ({ item, index }: { item: ExerciseDetail; index: number }) => (
    <View key={index} style={styles.exerciseDetailGroup}>
      <Text style={styles.exerciseTitle}>
        Exercise {index + 1}: {item.name}
      </Text>

      <View style={styles.labelGroup}>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>Set</Text>
          <TextInput style={styles.input} value={item.set} editable={false} />
        </View>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>Load</Text>
          <TextInput style={styles.input} value={item.load} editable={false} />
        </View>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>Reps</Text>
          <TextInput style={styles.input} value={item.reps} editable={false} />
        </View>
      </View>

      <View style={styles.labelGroup}>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>Variable</Text>
          <TextInput style={styles.input} value={item.variable} editable={false} />
        </View>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>Rest</Text>
          <TextInput style={styles.input} value={item.rest} editable={false} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Workout Details',
          headerBackVisible: false,
          headerTransparent: true,
          headerTintColor: '#4B84C4',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-circle-outline" size={28} color="#4B84C4" />
            </TouchableOpacity>
          ),
        }}
      />

      {hasLoaded && exercises.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>This workout doesn't have any exercises yet.</Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() =>
              router.replace({
                pathname: '/screen/Workout/WorkoutCreateDetail',
                params: { workoutId: workoutId },
              })
            }
          >
            <LinearGradient colors={['#4B84C4', '#77C4C6']} style={styles.startGradient}>
              <Text style={styles.startButtonText}>Add Exercises</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => renderExerciseSetRow({ item, index })}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {hasLoaded && exercises.length > 0 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() =>
              router.push({
                pathname: '/screen/Workout/WorkoutStart',
                params: { workoutId: workoutId?.toString() },
              })
            }
          >
            {/*<LinearGradient colors={['#4B84C4', '#77C4C6']} style={styles.startGradient}>*/}
            {/*  <Text style={styles.startButtonText}>Start Workout</Text>*/}
            {/*</LinearGradient>*/}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  listContainer: { padding: 16 },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noDataText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  startButton: { width: '100%' },
  startGradient: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: { fontSize: 16, color: '#FFF' },
  exerciseDetailGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    marginHorizontal: 16,
  },
  labelGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputBlock: {
    flexBasis: '30%',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
  },
});

export default WorkoutDetail;
