import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Modal,
  ScrollView
} from 'react-native';
import { Stack, useRouter } from 'expo-router'; // Import useRouter for navigation
import { Ionicons } from '@expo/vector-icons';

const TrainingScreen: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Need to change the routes for these items based on the role of client or PT.
  // The UI of screens for client side workout and programs - TODO

  // Sample data for the list (workouts, programs, exercises)
  const items = [
    {
      id: '1',
      title: 'Your Workouts',
      description: 'See your created workouts',
      type: 'workout', // To differentiate types
      route: '/screen/Workout/WorkoutList',
      icon: require('@/assets/images/YourWorkout.png'), // Placeholder icon
    },
    {
      id: '2',
      title: 'Your Programs',
      description: 'See your programs',
      type: 'program', // To differentiate types
      route: '/screen/Program/ProgramList',
      icon: require('@/assets/images/YourProgram.png'), // Placeholder icon
    },
    {
      id: '3',
      title: 'Exercises',
      description: 'Search the exercise library',
      type: 'exercise', // To differentiate types
      route: '/screen/Exercise/ExerciseLibrary',
      icon: require('@/assets/images/YourExercise.png'), // Placeholder icon
    },
  ];

  // Function to filter items based on the search query
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to render each list item (for both the main screen and filtered items)
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => router.push(item.route)} // Navigate to the respective route
    >
      <Image source={item.icon} style={styles.itemIcon} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

    <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackVisible: false,
          headerTransparent: true,
          headerTintColor: '#D9D9D9',
          headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back-circle-outline" size={28} color="#4B84C4" />
              </TouchableOpacity>
          ),
        }}
      />
      {/* Header */}
      <Text style={styles.header}>Training</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#777" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search workouts, programs & packages"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* List of Items */}
      {searchQuery ? (
        // Show filtered items if there is a search query
        <FlatList
          data={filteredItems} // If search query exists, show filtered items
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        // If no search query, show the main containers (Workouts, Programs, Exercises)
        <View>
          <FlatList
            data={items} // Show all items by default
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add-circle" size={50} color="#4B84C4" />
      </TouchableOpacity>

      {/* Modal for Create Options */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setIsModalVisible(false);
                router.push('/screen/Workout/createWorkout'); // Navigate to workout creation screen
              }}
            >
              <Text style={styles.modalOptionText}>Create Workout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setIsModalVisible(false);
                router.push('/screen/Program/create-program'); // Navigate to program creation screen
              }}
            >
              <Text style={styles.modalOptionText}>Create Program</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Josefin Sans',
    marginVertical: 10,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    color: '#777',
    marginLeft: 10,
  },
  listContainer: {
    paddingVertical: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  itemIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Josefin Sans',
    color: '#333',
  },
  itemDescription: {
    fontSize: 14,
    fontFamily: 'Josefin Sans',
    color: '#4B84C4',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignSelf: 'center',
    width: '80%',
  },
  modalOption: {
    paddingVertical: 10,
  },
  modalOptionText: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    color: '#333',
  },
});

export default TrainingScreen;