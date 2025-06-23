import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // for the "+" button
import { useRouter } from 'expo-router';
import * as Font from 'expo-font';

export default function TrainingNutritionScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Training & Nutrition</Text>

      {/* Training Card */}
      <TouchableOpacity
        style={[styles.card, styles.trainingCard]}
        onPress={() => router.push('../screen/training-screen')}
      >
        <Text style={styles.emoji}>💪</Text>
        <View>
          <Text style={styles.cardTitle}>Training</Text>
          <Text style={styles.cardSubtitle}>training</Text>
        </View>
      </TouchableOpacity>

      {/* Nutrition Card */}
      <TouchableOpacity
        style={[styles.card, styles.nutritionCard]}
        onPress={() => router.push('../screen/Nutrition/nutrition_screen')}
      >
        <Text style={styles.emoji}>📝</Text>
        <View>
          <Text style={styles.cardTitle}>Nutrition</Text>
          <Text style={styles.cardSubtitle}>See your nutrino</Text>
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
    fontFamily: 'Josefin Sans', // Use Josefin Sans Bold
    marginBottom: 20,
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
    fontFamily: 'Josefin Sans', // Use Josefin Sans Bold for card titles
    color: '#FFF',
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'Josefin Sans', // Use Josefin Sans Regular for card subtitles
    color: '#D1E9FF',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3777F3',
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
