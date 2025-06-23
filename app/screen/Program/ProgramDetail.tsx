import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { DynamoDBClient, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { getCurrentUser } from 'aws-amplify/auth';
import * as Crypto from 'expo-crypto';
import { useAuth } from '@/context/AuthContext';


const ProgramDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id, programName, selected } = useLocalSearchParams();
  const [workouts, setWorkouts] = useState<any[]>([]);

  const REGION = 'ap-southeast-2';
  const TABLE_PROGRAM_WORKOUT = 'ProgramsWorkout-ycmuiolpezdtdkkxmiwibhh6e4-staging';
  const TABLE_WORKOUT = 'Workout-ycmuiolpezdtdkkxmiwibhh6e4-staging';
  const TABLE_NEW_PROGRAM = 'Programs-ycmuiolpezdtdkkxmiwibhh6e4-staging';

  const { dynamoClient: client } = useAuth();


  useEffect(() => {
    const parsedSelected = selected ? (Array.isArray(selected) ? selected : JSON.parse(selected)) : null;
    if (parsedSelected) {
      setWorkouts(parsedSelected);
    } else {
      fetchWorkoutsId();
    }
  }, [selected]);

  const fetchWorkoutsId = async () => {
    try {
      const programData = await client.send(new ScanCommand({ TableName: TABLE_PROGRAM_WORKOUT }));

      const programItems = programData.Items?.map(item => ({
        id: item.id?.S,
        workoutId: item.workoutId.S,
        programsId: item.programsId.S,
      })) || [];

      const matchingPrograms = programItems.filter(p => p.programsId === id);
      fetchWorkouts(matchingPrograms);
    } catch (error) {
      console.error('Error fetching program workouts:', error);
    }
  };

  const fetchWorkouts = async (programWorkouts: any[]) => {
    try {
      const workoutIds = programWorkouts.map(pw => pw.workoutId);
      const workoutData = await client.send(new ScanCommand({ TableName: TABLE_WORKOUT }));

      const workoutItems = workoutData.Items?.map(item => ({
        id: item.id?.S,
        name: item.name?.S,
        image: item.image?.S ? { uri: item.image.S } : require('@/assets/images/WorkoutList.png'),
      })) || [];

      const matchingWorkouts = workoutItems.filter(w => workoutIds.includes(w.id));
      setWorkouts(matchingWorkouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const renderWorkout = ({ item }) => (
    <TouchableOpacity
      style={styles.workoutContainer}
      onPress={() => router.push('/screen/Workout/WorkoutDetail')}
    >
      <Image source={item.image} style={styles.workoutImage} />
      <Text style={styles.workoutName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const saveProgram = async () => {
    try {
      const user = await getCurrentUser();
      const userSub = user.userId;

      const newProgramItem = {
        id: Crypto.randomUUID(),
        name: Array.isArray(programName) ? programName.join(', ') : programName,
        userSubId: userSub,
      };

      await client.send(new PutItemCommand({
        TableName: TABLE_NEW_PROGRAM,
        Item: {
          id: { S: newProgramItem.id },
          name: { S: newProgramItem.name },
          userSubId: { S: newProgramItem.userSubId },
          __typename: { S: 'Programs' },
          createdAt: { S: new Date().toISOString() },
          updatedAt: { S: new Date().toISOString() },
        },
      }));

      for (const workout of workouts) {
        await client.send(new PutItemCommand({
          TableName: TABLE_PROGRAM_WORKOUT,
          Item: {
            id: { S: Crypto.randomUUID() },
            programsId: { S: newProgramItem.id },
            workoutId: { S: workout.id },
            __typename: { S: 'ProgramsWorkout' },
            createdAt: { S: new Date().toISOString() },
            updatedAt: { S: new Date().toISOString() },
          },
        }));
      }

      router.push('/screen/Program/ProgramSaved');
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  const renderFooter = () => (
    <TouchableOpacity
      style={styles.addWorkoutContainer}
      onPress={() => router.replace('/screen/Program/ProgramCreateDetail')}
    >
      <Ionicons name="add-circle-outline" size={24} color="#4B84C4" />
      <Text style={styles.addWorkoutText}>Add Workout</Text>
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
        <Text style={styles.headerTitle}>{programName}</Text>
      </View>
      {workouts.length ? (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={renderWorkout}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <Text>No workouts found</Text>
      )}
      <TouchableOpacity style={styles.saveButtonContainer} onPress={saveProgram}>
        <LinearGradient colors={['#4B84C4', '#77C4C6']} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Program</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // same styles as before
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontFamily: 'Josefin Sans', fontWeight: 'bold', color: '#333', marginLeft: 10 },
  listContainer: { paddingBottom: 20 },
  workoutContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 15, alignItems: 'center', elevation: 2 },
  workoutImage: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
  workoutName: { fontSize: 18, fontFamily: 'Josefin Sans', color: '#333' },
  addWorkoutContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: '#4B84C4', borderRadius: 10, paddingVertical: 20, marginBottom: 30 },
  addWorkoutText: { marginLeft: 10, fontSize: 18, fontFamily: 'Josefin Sans', color: '#4B84C4' },
  saveButtonContainer: { marginTop: 'auto', marginBottom: 30 },
  saveButton: { borderRadius: 30, paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { fontSize: 18, fontFamily: 'Josefin Sans', color: '#FFFFFF', fontWeight: 'bold' },
});

export default ProgramDetailScreen;
