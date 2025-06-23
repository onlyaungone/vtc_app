import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';

const ExerciseDetail: React.FC = () => {
  const router = useRouter();
  const {
    name,
    targetMuscle,
    equipment,
    secondaryMuscles,
    instructions,
    image,
  } = useLocalSearchParams();

  const parsedSecondaryMuscles = typeof secondaryMuscles === 'string'
    ? JSON.parse(secondaryMuscles)
    : [];

  const parsedInstructions = typeof instructions === 'string'
    ? JSON.parse(instructions)
    : [];

  const imageSrc = typeof image === 'string'
    ? { uri: image }
    : require('@/assets/images/exercise.png');

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <View style={styles.circleBackground}>
            <Ionicons name="arrow-back" size={20} color="#333" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise Detail</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.whiteContainer}>
          <Image source={imageSrc} style={styles.exerciseImage} />
          <Text style={styles.exerciseName}>{name}</Text>
          <Text style={styles.exerciseDetail}>Target Muscle: {targetMuscle}</Text>
          <Text style={styles.exerciseDetail}>Equipment: {equipment}</Text>
          <Text style={styles.exerciseDetail}>
            Secondary Muscles: {parsedSecondaryMuscles.join(', ') || 'None'}
          </Text>

          <Text style={styles.instructionsTitle}>Instructions</Text>
          {parsedInstructions.length > 0 ? parsedInstructions.map((step, index) => (
            <Text key={index} style={styles.instructions}>{index + 1}. {step}</Text>
          )) : (
            <Text style={styles.instructions}>No instructions provided.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  circleBackground: { backgroundColor: '#FFFFFF', borderRadius: 50, padding: 8, elevation: 2 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginLeft: 15, color: '#333' },
  contentContainer: { flexGrow: 1, paddingBottom: 80 },
  whiteContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
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
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  exerciseDetail: {
    fontSize: 16,
    color: '#777',
    marginBottom: 5,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  instructions: {
    fontSize: 16,
    color: '#777',
    lineHeight: 22,
  },
});

export default ExerciseDetail;
