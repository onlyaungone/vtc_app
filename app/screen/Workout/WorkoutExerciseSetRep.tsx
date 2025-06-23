import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { fetchAuthSession } from 'aws-amplify/auth';
import * as Crypto from 'expo-crypto';
import { ExerciseWithSets } from '@/constants/workout_types';
import { Ionicons } from '@expo/vector-icons';

const WorkoutExerciseSetRep: React.FC = () => {
  const router = useRouter();
  const { workoutName, safeExercises } = useLocalSearchParams();

  const REGION = process.env.EXPO_PUBLIC_AWS_REGION!;
  const ACCESS_KEY = process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID!;
  const SECRET_KEY = process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY!;

  const TABLEWORKOUT = 'Workout-ycmuiolpezdtdkkxmiwibhh6e4-staging';
  const EXERCISEWORKOUTTABLE = 'ExercisesWorkout-ycmuiolpezdtdkkxmiwibhh6e4-staging';
  const EXERCISEDETAILTABLE = 'ExerciseDetails-ycmuiolpezdtdkkxmiwibhh6e4-staging';

  const client = new DynamoDBClient({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });

  const [exercises, setExercises] = useState<ExerciseWithSets[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof safeExercises === 'string') {
      try {
        const parsed: ExerciseWithSets[] = JSON.parse(safeExercises);
        if (Array.isArray(parsed)) {
          setExercises(
            parsed.map((ex) => ({
              ...ex,
              id: ex.id?.trim(),
              sets: [{ set: '', load: '', reps: '', variable: '', rest: '' }],
            }))
          );
        }
      } catch (err) {
        console.error('Failed to parse safeExercises:', err);
      }
    }
  }, [safeExercises]);

  const saveToDynamoDB = async (command: PutItemCommand) => {
    try {
      await client.send(command);
    } catch (error) {
      console.error('DynamoDB error:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    for (const ex of exercises) {
      for (const s of ex.sets) {
        if (
          s.set === '' ||
          s.load === '' ||
          s.reps === '' ||
          s.variable === '' ||
          s.rest === ''
        ) {
          Alert.alert('Incomplete', 'Please fill out all fields before saving.');
          return;
        }
      }
    }

    setLoading(true);
    try {
      const session = await fetchAuthSession();
      const userSub = session.userSub ?? 'unknown-user';

      const workoutId = Crypto.randomUUID();
      await saveToDynamoDB(
        new PutItemCommand({
          TableName: TABLEWORKOUT,
          Item: {
            id: { S: workoutId },
            name: { S: String(workoutName || 'Unnamed Workout') },
            isComplete: { BOOL: false },
            userSubId: { S: userSub },
            __typename: { S: 'Workout' },
            createdAt: { S: new Date().toISOString() },
            updatedAt: { S: new Date().toISOString() },
          },
        })
      );

      for (const exercise of exercises) {
        if (!exercise.id) continue;

        const workoutExerciseId = Crypto.randomUUID();

        await saveToDynamoDB(
          new PutItemCommand({
            TableName: EXERCISEWORKOUTTABLE,
            Item: {
              id: { S: workoutExerciseId },
              exercisesId: { S: exercise.id },
              workoutId: { S: workoutId },
              exerciseName: { S: exercise.name || 'Unknown' },
              __typename: { S: 'ExercisesWorkout' },
              createdAt: { S: new Date().toISOString() },
              updatedAt: { S: new Date().toISOString() },
            },
          })
        );

        for (const set of exercise.sets) {
          await saveToDynamoDB(
            new PutItemCommand({
              TableName: EXERCISEDETAILTABLE,
              Item: {
                id: { S: Crypto.randomUUID() },
                set: { N: String(set.set) },
                load: { S: String(set.load) },
                reps: { S: String(set.reps) },
                variable: { S: String(set.variable) },
                rest: { S: String(set.rest) },
                workoutExerciseId: { S: workoutExerciseId },
                __typename: { S: 'ExerciseDetails' },
                createdAt: { S: new Date().toISOString() },
                updatedAt: { S: new Date().toISOString() },
              },
            })
          );
        }
      }

      Alert.alert('Success', 'Workout saved!');
      router.push('/screen/Workout/WorkoutList');
    } catch (error) {
      Alert.alert('Error', 'Failed to save workout.');
    } finally {
      setLoading(false);
    }
  };


  const renderSetsForExercise = (exercise: ExerciseWithSets, exIdx: number) =>
    exercise.sets.map((set, setIdx) => (
      <View key={`${exercise.id}-set-${setIdx}`} style={styles.inputRow}>
        {['set', 'load', 'reps', 'variable', 'rest'].map((field) => (
          <View style={styles.inputWrapper} key={field}>
            <Text style={styles.inputLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
            <TextInput
              style={styles.input}
              placeholder="Write..."
              keyboardType="numeric"
              value={(set as any)[field]}
              onChangeText={(text) =>
                setExercises((prev) =>
                  prev.map((ex, i) =>
                    i === exIdx
                      ? {
                          ...ex,
                          sets: ex.sets.map((s, j) =>
                            j === setIdx ? { ...s, [field]: text } : s
                          ),
                        }
                      : ex
                  )
                )
              }
            />
          </View>
        ))}
      </View>
    ));

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackVisible: false,
          headerTransparent: true,
          headerTintColor: '#D9D9D9',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-circle-outline" size={28} color="#4B84C4" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Week 1 - Day 1</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.setsHeader}>
          <Text style={styles.setsTitle}></Text>
        </View>
        {exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseContainer}>
            <Text style={styles.exerciseName}>Exercise {index + 1}: {exercise.name}</Text>
            {renderSetsForExercise(exercise, index)}
          </View>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSave} style={styles.buttonWrapper} disabled={loading}>
          <LinearGradient colors={['#4B84C4', '#77C4C6']} style={styles.gradientButton}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save</Text>}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  setsHeader: { marginBottom: 20 },
  setsTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  exerciseContainer: { backgroundColor: '#fff', borderRadius: 10, padding: 20, marginBottom: 15, elevation: 2 },
  exerciseName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  inputRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  inputWrapper: { flexBasis: '30%', marginBottom: 10 },
  inputLabel: { fontSize: 14, color: '#777', marginBottom: 5 },
  input: { backgroundColor: '#F5F5F5', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, borderColor: '#ddd', borderWidth: 1 },
  buttonContainer: { paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e0e0e0', position: 'absolute', bottom: 0, width: '100%' },
  buttonWrapper: { borderRadius: 30 },
  gradientButton: { paddingVertical: 15, borderRadius: 30, alignItems: 'center' },
  buttonText: { fontSize: 18, color: '#FFF', fontWeight: 'bold' },
});

export default WorkoutExerciseSetRep;