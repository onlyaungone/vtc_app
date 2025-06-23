import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Exercise } from '@/constants/workout_types';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const WorkoutExerciseSelection: React.FC = () => {
  const router = useRouter();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { workoutName, addedExercises } = useLocalSearchParams() || {};

  const REGION = process.env.EXPO_PUBLIC_AWS_REGION!;
  const ACCESS_KEY = process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID!;
  const SECRET_KEY = process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY!;
  const TABLE = 'Exercises-ycmuiolpezdtdkkxmiwibhh6e4-staging';

  const client = new DynamoDBClient({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });

  async function fetchExercises() {
    try {
      const params = { TableName: TABLE };
      const command = new ScanCommand(params);
      const data = await client.send(command);
      const items: Exercise[] = data.Items?.map(item => ({
        id: item.id?.S ?? '',  // Ensure it's always a string
        name: item.name?.S ?? '',
        targetMuscle: item.target?.S ?? '',
        equipment: item.equipment?.S ?? '',
        secondaryMuscles: item.secondaryMuscles?.L?.map(m => m.S ?? '') ?? [],
        instruction: item.instructions?.L?.map(s => s.S ?? '') ?? [],
        image: require('@/assets/images/WorkoutExerciseDescription.png'),
      })) ?? [];
      setExercises(items);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  }

  useEffect(() => {
    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.exerciseContainer}
      onPress={() =>
        router.push({
          pathname: '/screen/Workout/WorkoutExerciseDescription',
          params: {
            id: item.id,
            name: item.name,
            targetMuscle: item.targetMuscle,
            equipment: item.equipment,
            secondaryMuscles: JSON.stringify(item.secondaryMuscles),
            instruction: JSON.stringify(item.instruction),
            image: Image.resolveAssetSource(item.image).uri,
            addedExercises,
            workoutName,
          },
        })
      }
    >
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseSubtitle}>Target: {item.targetMuscle}</Text>
      </View>
      <Image source={item.image} style={styles.exerciseImage} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Select Exercise',
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


      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.buttonContainer}>
        <LinearGradient
          colors={['#4B84C4', '#77C4C6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    elevation: 2,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontFamily: 'Josefin Sans',
    fontSize: 16,
    color: '#333',
  },
  listContainer: { paddingBottom: 20 },
  exerciseContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 1,
  },
  exerciseInfo: { flex: 1 },
  exerciseName: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    color: '#333',
  },
  exerciseSubtitle: {
    fontSize: 14,
    fontFamily: 'Josefin Sans',
    color: '#777',
    marginTop: 5,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
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

export default WorkoutExerciseSelection;
