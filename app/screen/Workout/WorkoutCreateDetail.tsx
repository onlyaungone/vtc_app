import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; 

const WorkoutCreateDetail: React.FC = () => {
  const router = useRouter();
  const { workoutName, selectedExercises } = useLocalSearchParams() || {}; // Safe destructuring with default
  // Initialize exercises state with the selected exercises passed from the previous screen
  const [exercises, setExercises] = useState(selectedExercises || []);
  const safeExercises = Array.isArray(exercises) 
  ? exercises 
  : typeof exercises === 'string' 
    ? JSON.parse(exercises) 
    : [];  

  const renderExerciseItem = ({ item }) => {
  return (
    <View style={styles.exerciseContainer}>
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseDetail}>Target Muscle: {item.targetMuscle}</Text>
        <Text style={styles.exerciseDetail}>Equipment: {item.equipment}</Text>
        <Text style={styles.exerciseDetail}>
          Secondary Muscles: {(item.secondaryMuscles || []).join(', ')}
        </Text>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveExercise(item.id)}
        >
          <Ionicons name="trash" size={18} color="#FF4D4D" />
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <Image source={item.image} style={styles.exerciseImage} />
    </View>
  );
};

  const handleRemoveExercise = (idToRemove) => {
    const updated = safeExercises.filter((ex) => ex.id !== idToRemove);
    setExercises(updated);
  };

  const renderFooter = () =>{ 

    return(

    <TouchableOpacity
      style={[styles.addExerciseContainer, exercises.length > 0 && { marginTop: 20 }]}
      onPress={() => router.push({pathname:'/screen/Workout/WorkoutExerciseSelection', 
        params: {
          workoutName:workoutName,
          addedExercises: JSON.stringify(safeExercises),  // Pass the updated exercises as JSON
        }}
      )}
    >
      <Ionicons name="add-circle" size={20} color="#4B84C4" />
      <Text style={styles.addExerciseText}>Add Exercise</Text>
    </TouchableOpacity>
  )
};

  const handleSave = async () => {
    if (safeExercises.length === 0) {
      Alert.alert('No Exercises Selected', 'Please add at least one exercise before continuing.');
      return;
    }

    try {
      router.push({
        pathname: "/screen/Workout/WorkoutExerciseSetRep",
        params: {
          workoutName: workoutName,
          safeExercises: JSON.stringify(safeExercises),
        },
      });
    } catch (error) {
      console.error('Error navigating to set/rep screen:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>

<Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Workout Create Lists',
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
      
  
      {/* Header */}
      <View style={styles.header}>
        
        {/* <TouchableOpacity onPress={() => router.back()}>
          <View style={styles.circleBackground}>
            <Ionicons name="arrow-back" size={20} color="#333" />
          </View>
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>{workoutName || 'Workout'}</Text>
        
      </View>

      {/* Exercise List or Empty State */}
      {exercises.length === 0 ? (
        <View style={styles.contentContainer}>
          <Text style={styles.emptyMessage}>Nothing here yet!</Text>
          {renderFooter()} 
        </View>
      ) : (
        <FlatList
          data={safeExercises}
          keyExtractor={(item) => item.id} // Ensure each item has a unique key
          renderItem={renderExerciseItem}
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
            <Text style={styles.buttonText}>Continue</Text>
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
  addExerciseContainer: {
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
  addExerciseText: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    color: '#4B84C4',
  },
  listContainer: {
    paddingBottom: 100,
  },
  exerciseContainer: {
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
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    color: '#333',
  },
  exerciseDetail: {
    fontSize: 14,
    fontFamily: 'Josefin Sans',
    color: '#777',
    marginTop: 2,
  },
  exerciseImage: {
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
  removeButton: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 8,
},
removeButtonText: {
  color: '#FF4D4D',
  marginLeft: 5,
  fontSize: 14,
  fontFamily: 'Josefin Sans',
},
});

export default WorkoutCreateDetail;
