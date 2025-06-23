import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';


const ProgramCreateDetail: React.FC = () => {
  const router = useRouter();
  const { programName, selectedWorkouts } = useLocalSearchParams() || {}; // Safe destructuring with default

  // Initialize workouts state with the selected workouts passed from the previous screen
  const [workouts, setWorkouts] = useState(selectedWorkouts || []);
  const safeWorkouts = Array.isArray(workouts)
    ? workouts
    : typeof workouts === 'string'
      ? JSON.parse(workouts)
      : [];

  const renderWorkoutItem = ({ item }) => {
    // Logging the item to check its content

    // Render each workout with its details
    return (
      <TouchableOpacity style={styles.workoutContainer}>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutName}>{item.name}</Text>
        </View>
        <Image source={item.image} style={styles.workoutImage} />
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    return (
      <TouchableOpacity
        style={[styles.addWorkoutContainer, workouts.length > 0 && { marginTop: 20 }]}
        onPress={() =>
          router.push({
            pathname: '/screen/Program/ProgramWorkoutSelection',
            params: {
              programName: programName,
              addedWorkouts: JSON.stringify(safeWorkouts), // Pass the updated workouts as JSON
            },
          })
        }
      >
        <Ionicons name="add-circle" size={20} color="#4B84C4" />
        <Text style={styles.addWorkoutText}>Add Workout</Text>
      </TouchableOpacity>
    );
  };

  const handleSave = async () => {
    try {
      router.replace({
        pathname: '/screen/Program/ProgramSaved',
        params: { programName: programName, safeWorkouts: JSON.stringify(safeWorkouts) },
      });
    } catch (error) {
      console.error('Error saving program details:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackVisible: false,
          headerTransparent: true,
          headerTintColor: '#D9D9D9',
        }}
      />
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => router.back()}>
          <View style={styles.circleBackground}>
            <Ionicons name="arrow-back" size={20} color="#333" />
          </View>
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>{programName || 'Program'}</Text>
      </View>

      {/* Workout List or Empty State */}
      {workouts.length === 0 ? (
        <View style={styles.contentContainer}>
          <Text style={styles.emptyMessage}>Nothing here yet!</Text>
          {renderFooter()}
        </View>
      ) : (
        <FlatList
          data={safeWorkouts}
          keyExtractor={(item) => item.id} // Ensure each item has a unique key
          renderItem={renderWorkoutItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
        />
      )}

      {/* Continue/Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSave} style={styles.buttonWrapper}>
          <LinearGradient
            colors={['#4B84C4', '#77C4C6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Save Program</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  circleBackground: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#333',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    color: '#777',
    marginBottom: 20,
  },
  addWorkoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#4B84C4',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  addWorkoutText: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    color: '#4B84C4',
  },
  listContainer: {
    paddingBottom: 100,
  },
  workoutContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    color: '#333',
  },
  workoutImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginLeft: 10,
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

export default ProgramCreateDetail;
