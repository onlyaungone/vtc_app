import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function TrainingNutritionScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: '',
      headerBackVisible: false,
      headerTintColor: '#000',
      headerTitleStyle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Josefin Sans',
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Training & Nutrition</Text>

      <TouchableOpacity
        style={[styles.card, styles.trainingCard]}
        onPress={() => router.push('/screen/Exercise/ExerciseLibrary')}
      >
        <Text style={styles.emoji}>💪</Text>
        <View>
          <Text style={styles.cardTitle}>Training</Text>
          <Text style={styles.cardSubtitle}>Explore workouts</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.nutritionCard]}
        onPress={() => router.push('/screen/Nutrition/nutrition_screen')}
      >
        <Text style={styles.emoji}>📝</Text>
        <View>
          <Text style={styles.cardTitle}>Nutrition</Text>
          <Text style={styles.cardSubtitle}>Track your meals</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Josefin Sans',
    marginVertical: 30,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  trainingCard: {
    backgroundColor: '#58a6ff',
  },
  nutritionCard: {
    backgroundColor: '#4C7DD0',
  },
  emoji: {
    fontSize: 40,
    marginRight: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Josefin Sans',
    color: '#FFF',
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'Josefin Sans',
    color: '#D1E9FF',
  },
});
