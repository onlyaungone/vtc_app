import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import * as Crypto from 'expo-crypto';

const WorkoutExerciseDescription: React.FC = () => {
  const router = useRouter();
  const {
    name,
    targetMuscle,
    equipment,
    secondaryMuscles,
    instruction,
    image,
    addedExercises,
    workoutName,
  } = useLocalSearchParams();

  // Ensure correct parsing of complex props
  const parsedSecondaryMuscles = typeof secondaryMuscles === 'string'
    ? JSON.parse(secondaryMuscles)
    : [];
  const parsedInstructions = typeof instruction === 'string'
    ? JSON.parse(instruction)
    : [];

  const imageSrc = typeof image === 'string'
    ? { uri: image }
    : require('@/assets/images/WorkoutExerciseDescription.png'); // fallback

  const handleAddExercise = () => {
    const saExercises = Array.isArray(addedExercises)
      ? addedExercises
      : typeof addedExercises === 'string'
      ? JSON.parse(addedExercises)
      : [];

    const newExercise = {
      id: Crypto.randomUUID(),
      name,
      targetMuscle,
      equipment,
      secondaryMuscles: parsedSecondaryMuscles,
      instruction: parsedInstructions,
      image: imageSrc,
    };

    const updatedExercises = [...saExercises, newExercise];

    router.push({
      pathname: '/screen/Workout/WorkoutCreateDetail',
      params: {
        selectedExercises: JSON.stringify(updatedExercises),
        workoutName: workoutName,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Exercise Detail',
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
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.whiteContainer}>
          <Image source={imageSrc} style={styles.exerciseImage} />
          <Text style={styles.exerciseName}>{name}</Text>
          <Text style={styles.exerciseDetail}>Target Muscle: {targetMuscle}</Text>
          <Text style={styles.exerciseDetail}>Equipment: {equipment}</Text>
          <Text style={styles.exerciseDetail}>
            Secondary Muscles: {parsedSecondaryMuscles.join(', ')}
          </Text>

          <Text style={styles.instructionsTitle}>Instructions</Text>
          {parsedInstructions.map((step, index) => (
            <Text key={index} style={styles.instructions}>{index + 1}. {step}</Text>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleAddExercise} style={styles.buttonWrapper}>
          <LinearGradient
            colors={['#4B84C4', '#77C4C6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Add Exercise</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#333',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  whiteContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  exerciseImage: {
    width: '100%',
    height: 290,
    borderRadius: 10,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 24,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  exerciseDetail: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    color: '#777',
    marginBottom: 5,
  },
  instructionsTitle: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  instructions: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    color: '#777',
    lineHeight: 22,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
    paddingHorizontal: 20,
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

export default WorkoutExerciseDescription;
