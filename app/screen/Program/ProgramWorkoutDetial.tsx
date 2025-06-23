import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';

const ProgramWorkoutDetail: React.FC = () => {
  const router = useRouter();

  // Tab state to toggle between "Overview" and "Today's Workout"
  const [activeTab, setActiveTab] = useState('Overview');

  // Sample data for exercises
  const exercises = [
    {
      id: '1',
      name: 'Squat',
      set: '1',
      load: '4',
      reps: '5',
      variable: '7',
      rest: '5',
      image: require('@/assets/images/Chestpress.png'),
    },
    {
      id: '2',
      name: 'Bent-over row',
      set: '1',
      load: '3',
      reps: '5',
      variable: '6',
      rest: '5',
      image: require('@/assets/images/shoulderlift.png'),
    },
    {
      id: '3',
      name: 'Push-up',
      set: '1',
      load: '3',
      reps: '2',
      variable: '4',
      rest: '5',
      image: require('@/assets/images/innerchestPushup.png'),
    },
    {
      id: '4',
      name: 'Lunge',
      set: '1',
      load: '3',
      reps: '5',
      variable: '5',
      rest: '5',
      image: require('@/assets/images/shoulderLift2.png'),
    },
  ];

  // Render the exercise with a row of categories and input boxes for "Today's Workout"
  const renderExerciseSetRow = ({ item }) => (
    <View style={styles.setsContainer}>
      <Text style={styles.exerciseTitle}>{item.name}</Text>
      <View style={styles.categoryRow}>
        <Text style={styles.categoryTitle}>Set</Text>
        <Text style={styles.categoryTitle}>Load</Text>
        <Text style={styles.categoryTitle}>Reps</Text>
        <Text style={styles.categoryTitle}>Variable</Text>
        <Text style={styles.categoryTitle}>Rest</Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputBox}
          placeholder="Write..."
          value={item.set}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Write..."
          value={item.load}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Write..."
          value={item.reps}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Write..."
          value={item.variable}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Write..."
          value={item.rest}
        />
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Program Workout Name</Text>
      </View>

      {/* Tab View */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Overview' && styles.activeTab]}
          onPress={() => setActiveTab('Overview')}
        >
          <LinearGradient
            colors={activeTab === 'Overview' ? ['#4B84C4', '#77C4C6'] : ['#FFFFFF', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.tabGradient,
              activeTab === 'Overview' ? styles.activeTabGradient : {},
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Overview' && styles.activeTabText,
              ]}
            >
              Overview
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Today\'s Workout' && styles.activeTab]}
          onPress={() => setActiveTab("Today's Workout")}
        >
          <LinearGradient
            colors={activeTab === "Today's Workout" ? ['#4B84C4', '#77C4C6'] : ['#FFFFFF', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.tabGradient,
              activeTab === "Today's Workout" ? styles.activeTabGradient : {},
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Today's Workout" && styles.activeTabText,
              ]}
            >
              Today's Workout
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      {activeTab === 'Overview' ? (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.exerciseContainer}
              onPress={() =>
                router.push({ pathname: '../screen/Exercise/ExerciseDetail', params: { exerciseId: item.id } })
              }
            >
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Image source={item.image} style={styles.exerciseImage} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={renderExerciseSetRow}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderRadius: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  tabGradient: {
    width: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    backgroundColor: '#4B84C4',
  },
  activeTabGradient: {
    borderRadius: 20,
  },
  tabText: {
    fontFamily: 'Josefin Sans',
    fontSize: 16,
    color: '#777',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  exerciseContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  exerciseName: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    color: '#333',
  },
  exerciseImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  setsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  exerciseTitle: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    color: '#333',
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputBox: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
    textAlign: 'center',
    fontFamily: 'Josefin Sans',
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});

export default ProgramWorkoutDetail;