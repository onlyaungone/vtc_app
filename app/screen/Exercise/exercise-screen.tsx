import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { useAuth } from '@/context/AuthContext';

const ExerciseListScreen = () => {
  const router = useRouter();
  const { dynamoClient } = useAuth();

  const [exercises, setExercises] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const TABLE = 'Exercises-ycmuiolpezdtdkkxmiwibhh6e4-staging';

  const fetchExercises = async () => {
    try {
      const data = await dynamoClient.send(new ScanCommand({ TableName: TABLE }));
      const items = data.Items?.map((item) => ({
        id: item.id?.S,
        name: item.name?.S,
        targetMuscle: item.target?.S,
        equipment: item.equipment?.S,
        bodyPart: item.bodyPart?.S,
        secondaryMuscles: item.secondaryMuscles?.L?.map((m) => m.S) ?? [],
        instructions: item.instructions?.L?.map((m) => m.S) ?? [],
        image: item.image?.S ? { uri: item.image.S } : undefined,
      })) ?? [];
      setExercises(items);
    } catch (err) {
      console.error('Error fetching exercises:', err);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExercisePress = (exercise: {
    id: string;
    name: string;
    targetMuscle: string;
    equipment: string;
    secondaryMuscles: string[];
    instructions: string[];
    image?: { uri: string };
  }) => {
    router.push({
      pathname: '/screen/Exercise/exerciseDescription',
      params: {
        name: exercise.name,
        targetMuscle: exercise.targetMuscle,
        equipment: exercise.equipment,
        secondaryMuscles: JSON.stringify(exercise.secondaryMuscles),
        instructions: JSON.stringify(exercise.instructions),
        image: exercise.image?.uri,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.header}>Exercise Library</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search exercise..."
        placeholderTextColor="#A0A0A0"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView style={styles.scrollBar}>
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.scrollItem}
              onPress={() => handleExercisePress(exercise)}
            >
              <View style={styles.itemContent}>
                {exercise.image ? (
                  <Image source={exercise.image} style={styles.exerciseImage} />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )}
                <Text style={styles.scrollItemText}>{exercise.name}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultsText}>No exercises found</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Josefin Sans',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    fontFamily: 'Josefin Sans',
  },
  scrollBar: {
    marginBottom: 20,
  },
  scrollItem: {
    backgroundColor: '#E0F7FA',
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollItemText: {
    fontSize: 16,
    color: '#00796B',
    fontWeight: 'bold',
    fontFamily: 'Josefin Sans',
    marginLeft: 10,
  },
  exerciseImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#A0A0A0',
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    marginTop: 10,
  },
});

export default ExerciseListScreen;
