import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { getCurrentUser } from 'aws-amplify/auth';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const ExerciseLibrary = () => {
  const router = useRouter();
  const [exercises, setExercises] = useState<
    { id?: string; name?: string; bodyPart?: string; category?: string; image?: any }[]
  >([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState('Any body part');
  const [selectedCategory, setSelectedCategory] = useState('Any Category');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBodyPartModalVisible, setBodyPartModalVisible] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

  const TABLE = 'Exercises-ycmuiolpezdtdkkxmiwibhh6e4-staging';

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const user = await getCurrentUser(); // ✅ Get current user (if needed)
        if (!user) throw new Error('User not authenticated');

        const client = new DynamoDBClient({
          region: 'ap-southeast-2',
          credentials: {
            accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
          },
        });

        const command = new ScanCommand({ TableName: TABLE });
        const data = await client.send(command);

        const items = data.Items?.map((item) => ({
          id: item.id?.S,
          name: item.name?.S,
          bodyPart: item.bodyPart?.S,
          category: item.equipment?.S,
          secondaryMuscles: item.secondaryMuscles?.L?.map((m) => m.S) ?? [],
          instructions: item.instructions?.L?.map((i) => i.S) ?? [],
          image: require('@/assets/images/exercise.png'),
        }));

        setExercises(items || []);
      } catch (error) {
        console.error('❌ Error fetching exercises:', error);
      }
    };

    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesBodyPart =
      selectedBodyPart === 'Any body part' || exercise.bodyPart === selectedBodyPart;
    const matchesCategory =
      selectedCategory === 'Any Category' || exercise.category === selectedCategory;
    const matchesSearch = (exercise.name ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBodyPart && matchesCategory && matchesSearch;
  });

  const handleExercisePress = (exercise: any) => {
    router.push({
      pathname: '/screen/Exercise/exerciseDescription', // Ensure valid relative route
      params: {
        name: exercise.name,
        targetMuscle: exercise.bodyPart,
        equipment: exercise.category,
        secondaryMuscles: JSON.stringify(exercise.secondaryMuscles),
        instructions: JSON.stringify(exercise.instructions),
        image: exercise.image?.uri,
      },
    });

  };

  const renderExercise = ({ item }) => (
    <TouchableOpacity
      style={styles.exerciseContainer}
      onPress={() => handleExercisePress(item)}
    >
      <Image source={item.image} style={styles.exerciseImage} />
      <View style={styles.exerciseDetails}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseCategory}>{item.bodyPart}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderModalItem = ({ item, setSelectedValue, closeModal }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedValue(item);
        closeModal();
      }}
    >
      <Text style={styles.modalItem}>{item}</Text>
    </TouchableOpacity>
  );

  const bodyParts = [
    'Any body part',
    'Core',
    'Arms',
    'Back',
    'Chest',
    'Legs',
    'Shoulder',
    'Other',
    'Olympic',
    'Full Body',
    'Cardio',
  ];
  const categories = [
    'Any Category',
    'Barbell',
    'Dumbbell',
    'Machine/Other',
    'Weighted Bodyweight',
    'Assisted Bodyweight',
    'Reps Only',
    'Cardio',
    'Duration',
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerTintColor: '#D9D9D9',
        }}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exercises</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder=" 🔍 Search exercise library"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setBodyPartModalVisible(true)}
        >
          <Text style={styles.filterText}>{selectedBodyPart}</Text>
          <Ionicons name="chevron-down" size={16} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text style={styles.filterText}>{selectedCategory}</Text>
          <Ionicons name="chevron-down" size={16} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={renderExercise}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Body Part Modal */}
      <Modal
        transparent={true}
        visible={isBodyPartModalVisible}
        animationType="slide"
        onRequestClose={() => setBodyPartModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <FlatList
              data={bodyParts}
              keyExtractor={(item) => item}
              renderItem={({ item }) =>
                renderModalItem({
                  item,
                  setSelectedValue: setSelectedBodyPart,
                  closeModal: () => setBodyPartModalVisible(false),
                })
              }
            />
          </View>
        </View>
      </Modal>

      {/* Category Modal */}
      <Modal
        transparent={true}
        visible={isCategoryModalVisible}
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) =>
                renderModalItem({
                  item,
                  setSelectedValue: setSelectedCategory,
                  closeModal: () => setCategoryModalVisible(false),
                })
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingTop: 50
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginLeft: 10,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontFamily: 'Josefin Sans',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: '45%',
  },
  filterText: {
    fontFamily: 'Josefin Sans',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  exerciseContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  exerciseDetails: {
    justifyContent: 'center',
  },
  exerciseName: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    color: '#333',
    marginBottom: 5,
  },
  exerciseCategory: {
    fontSize: 14,
    fontFamily: 'Josefin Sans',
    color: '#777',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalItem: {
    padding: 10,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ExerciseLibrary;
