import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Image, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getCurrentUser } from 'aws-amplify/auth';
import {
  ScanCommand, DeleteItemCommand, PutItemCommand
} from '@aws-sdk/client-dynamodb';
import * as Crypto from 'expo-crypto';
import { useAuth } from '@/context/AuthContext';

const ProgramEditDetail: React.FC = () => {
  const { id, programName } = useLocalSearchParams();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { dynamoClient: client } = useAuth();
  const TABLE_PROGRAM_WORKOUT = 'ProgramsWorkout-ycmuiolpezdtdkkxmiwibhh6e4-staging';
  const TABLE_WORKOUT = 'Workout-ycmuiolpezdtdkkxmiwibhh6e4-staging';

  useEffect(() => {
    fetchExistingProgramWorkouts();
  }, []);

  const fetchExistingProgramWorkouts = async () => {
    try {
      const linksData = await client.send(new ScanCommand({ TableName: TABLE_PROGRAM_WORKOUT }));
      const programLinks = linksData.Items?.filter(item => item.programsId.S === id) || [];
      const workoutIds = programLinks.map(link => link.workoutId.S);

      const workoutsData = await client.send(new ScanCommand({ TableName: TABLE_WORKOUT }));
      const allWorkouts = workoutsData.Items?.map(item => ({
        id: item.id.S,
        name: item.name.S,
        image: item.image?.S ? { uri: item.image.S } : require('@/assets/images/WorkoutList.png'),
      })) || [];

      const filtered = allWorkouts.filter(w => workoutIds.includes(w.id));
      setWorkouts(filtered);
      setSelectedIds(workoutIds.filter((id): id is string => typeof id === 'string')); // Pre-select
    } catch (err) {
      console.error('Error fetching workouts:', err);
    }
  };

  const toggleSelectWorkout = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(wid => wid !== id) : [...prev, id]
    );
  };

  const updateProgram = async () => {
    try {
      const currentLinks = await client.send(new ScanCommand({ TableName: TABLE_PROGRAM_WORKOUT }));
      const toDelete = currentLinks.Items?.filter(item => item.programsId.S === id) || [];

      for (const link of toDelete) {
        if (link.id?.S) {
          await client.send(new DeleteItemCommand({
            TableName: TABLE_PROGRAM_WORKOUT,
            Key: { id: { S: link.id.S } },
          }));
        }
      }

      for (const wid of selectedIds) {
        await client.send(new PutItemCommand({
          TableName: TABLE_PROGRAM_WORKOUT,
          Item: {
            id: { S: Crypto.randomUUID() },
            programsId: { S: id as string },
            workoutId: { S: wid },
            __typename: { S: 'ProgramsWorkout' },
            createdAt: { S: new Date().toISOString() },
            updatedAt: { S: new Date().toISOString() },
          },
        }));
      }

      Alert.alert('Success', 'Program updated successfully');
      router.replace('/screen/Program/ProgramList'); // Navigate back to the program list
    } catch (err) {
      console.error('Error updating program:', err);
      Alert.alert('Error', 'Failed to update program');
    }
  };

  const renderWorkout = ({ item }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <TouchableOpacity
        style={[
          styles.workoutContainer,
          isSelected && { backgroundColor: '#E6F0FF' },
        ]}
        onPress={() => toggleSelectWorkout(item.id)}
      >
        <Image source={item.image} style={styles.workoutImage} />
        <Text style={styles.workoutName}>{item.name}</Text>
        <Ionicons
          name={isSelected ? 'checkbox' : 'square-outline'}
          size={22}
          color={isSelected ? '#4B84C4' : '#ccc'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackVisible: true,
          headerTransparent: true,
          headerTintColor: '#D9D9D9',
        }}
      />

      <Text style={styles.headerTitle}>Edit Program: {programName}</Text>

      <FlatList
        data={workouts}
        keyExtractor={item => item.id}
        renderItem={renderWorkout}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.saveButtonContainer} onPress={updateProgram}>
        <LinearGradient colors={['#4B84C4', '#77C4C6']} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Update Program</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingHorizontal: 20 },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 80,
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: { paddingBottom: 20 },
  workoutContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    justifyContent: 'space-between',
  },
  workoutImage: { width: 50, height: 50, borderRadius: 8, marginRight: 15 },
  workoutName: { flex: 1, fontSize: 16, color: '#333' },
  saveButtonContainer: { marginTop: 'auto', marginBottom: 30 },
  saveButton: {
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ProgramEditDetail;
