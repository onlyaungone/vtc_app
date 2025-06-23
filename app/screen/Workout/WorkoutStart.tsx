import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

interface WorkoutSet {
  set: number;
  load: string;
  reps: string;
  variable: string;
  rest: string;
}

interface WorkoutExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
  image: any;
}

const WorkoutStartPage: React.FC = () => {
  const router = useRouter();
  const { workoutId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [workoutData, setWorkoutData] = useState<WorkoutExercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const REGION = process.env.EXPO_PUBLIC_AWS_REGION ?? '';
  const ACCESS_KEY = process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID ?? '';
  const SECRET_KEY = process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY ?? '';

  const client = new DynamoDBClient({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });

  async function fetchAllItems(tableName: string): Promise<any[]> {
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

  useEffect(() => {
    if (!workoutId || typeof workoutId !== 'string') {
      console.warn("⚠️ workoutId is missing or invalid:", workoutId);
      setLoading(false);
      return;
    }

    const fetchWorkout = async () => {
      try {
        const [exerciseItems, workoutExerciseItems, detailItems] = await Promise.all([
          fetchAllItems('Exercises-ycmuiolpezdtdkkxmiwibhh6e4-staging'),
          fetchAllItems('ExercisesWorkout-ycmuiolpezdtdkkxmiwibhh6e4-staging'),
          fetchAllItems('ExerciseDetails-ycmuiolpezdtdkkxmiwibhh6e4-staging'),
        ]);

        const workoutExercises = workoutExerciseItems
          .filter((item) => item.workoutId?.S?.trim() === workoutId.trim())
          .sort((a, b) => (a.createdAt?.S ?? '').localeCompare(b.createdAt?.S ?? ''));

        const exercises = workoutExercises.map((we) => {
          const sets = detailItems.filter(
            (d) => d.workoutExerciseId?.S === we.id?.S
          ).map((s) => ({
            id: s.id?.S || '',
            set: Number(s.set?.N ?? '1'),
            load: s.load?.S || '',
            reps: s.reps?.S || '',
            variable: s.variable?.S || '',
            rest: s.rest?.S || '',
          }));

          const exerciseName =
            exerciseItems.find((e) => e.id?.S === we.exercisesId?.S)?.name?.S ||
            we.exerciseName?.S || 'Unknown';

          return {
            id: we.id?.S || '',
            name: exerciseName,
            sets,
            image: require('@/assets/images/exercise.png'),
          };
        });

        setWorkoutData(exercises);
        setStartTime(Date.now());
      } catch (err) {
        console.error('💥 Failed to load workout data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [workoutId]);

  const handleInputChange = (exerciseId: string, setIndex: number, field: string, value: string) => {
    setWorkoutData(prev =>
      prev.map(exercise =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set, i) =>
                i === setIndex ? { ...set, [field]: field === 'set' ? Number(value) : value } : set
              )
            }
          : exercise
      )
    );
  };

  const handleNext = () => {
    if (currentIndex < workoutData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleCompleteWorkout = () => {
    // 🔍 Validate all fields
    for (const exercise of workoutData) {
      for (const s of exercise.sets) {
        if (
          s.set === undefined || s.set === null || s.set === 0 ||
          s.load.trim() === '' ||
          s.reps.trim() === '' ||
          s.variable.trim() === '' ||
          s.rest.trim() === ''
        ) {
          Alert.alert('Incomplete Input', 'Please fill out all fields for every set before continuing.');
          return;
        }
      }
    }

    const endTime = Date.now();
    const duration = startTime ? Math.floor((endTime - startTime) / 1000) : 0;

    router.push({
      pathname: '/screen/Workout/WorkoutComplete',
      params: {
        workoutData: JSON.stringify(workoutData),
        workoutId: String(workoutId),
        duration: String(duration),
      },
    });
  };

  const renderSetRow = (exerciseId: string, set: WorkoutSet, index: number) => (
    <View key={index} style={styles.exerciseDetailGroup}>
      <View style={styles.labelGroup}>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>Set</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(set.set)}
            onChangeText={(text) => handleInputChange(exerciseId, index, 'set', text)}
          />
        </View>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>Load</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(set.load)}
            onChangeText={(text) => handleInputChange(exerciseId, index, 'load', text)}
          />
        </View>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>Reps</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(set.reps)}
            onChangeText={(text) => handleInputChange(exerciseId, index, 'reps', text)}
          />
        </View>
      </View>

      <View style={styles.labelGroup}>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>Variable</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(set.variable)}
            onChangeText={(text) => handleInputChange(exerciseId, index, 'variable', text)}
          />
        </View>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>Rest</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(set.rest)}
            onChangeText={(text) => handleInputChange(exerciseId, index, 'rest', text)}
          />
        </View>
      </View>
    </View>
  );

  const currentExercise = workoutData[currentIndex];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: 'Workout',
            headerTransparent: true,
            headerBackVisible: true,
            headerTitleAlign: 'center',
            headerTintColor: '#4B84C4',
          }}
        />

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#4B84C4" />
          </View>
        ) : workoutData.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No exercises found.</Text>
          </View>
        ) : (
          <View style={styles.wrapper}>
            <View style={styles.exerciseContainer}>
              <Image source={currentExercise.image} style={styles.exerciseImage} />
              <Text style={styles.exerciseName}>{currentExercise.name}</Text>
              {currentExercise.sets.map((set, index) =>
                renderSetRow(currentExercise.id, set, index)
              )}
            </View>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={currentIndex === workoutData.length - 1 ? handleCompleteWorkout : handleNext}
            >
              <LinearGradient colors={['#4B84C4', '#77C4C6']} style={styles.nextButton}>
                <Text style={styles.buttonText}>
                  {currentIndex === workoutData.length - 1 ? 'Complete Workout' : 'Next'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  exerciseContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'left',
  },
  exerciseDetailGroup: {
    marginBottom: 30,
  },
  labelGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputBlock: {
    width: '30%',
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
    borderRadius: 10,
    borderColor: '#DDD',
    borderWidth: 1,
    fontSize: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  nextButton: {
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default WorkoutStartPage;
