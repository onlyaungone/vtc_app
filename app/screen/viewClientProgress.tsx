import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal, TextInput, Button,
  Pressable,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

// Helper function to format date as MM/DD/YY
const getCurrentDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
  return `${month}/${day}/${year}`;
};

export default function clientProgress() {
    const router = useRouter();
  // Hardcoded initial values for line chart (body weight tracking)
  const [weights, setWeights] = useState([75, 74, 73.5, 73, 72.5, 72.8]);
  const [photos, setPhotos] = useState([
    { uri: 'https://via.placeholder.com/100', date: '10/01/24' },
    { uri: 'https://via.placeholder.com/100', date: '10/01/24' },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputWeight, setInputWeight] = useState('');

  // Handler for adding photos
  const addPhoto = () => {
    const currentDate = getCurrentDate(); // Get the current date
    setPhotos([...photos, { uri: 'https://via.placeholder.com/100', date: currentDate }]);
  };

  // Handler for submitting weight
  const submitWeight = () => {
    if (inputWeight && !isNaN(Number(inputWeight))) {
      setWeights([...weights, parseFloat(inputWeight)]); // Add new weight from input
      setInputWeight(''); // Clear input field
      setIsModalVisible(false); // Close modal
    }
  };

  // Show modal for adding weight
  const openWeightModal = () => {
    setIsModalVisible(true);
  };

  // Close modal without submitting
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const goToClientSteps = () => {
    router.push('/trainerHome/home-screen'); 
  }

  const goToClientNutrition = () => {
    router.push('/screen/Nutrition/nutrition_screen'); 
  }

  const goToClientWaterIntake = () => {
    router.push('/trainerHome/home-screen'); 
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackVisible: false,
          headerTransparent: true,
          headerTintColor: '#D9D9D9',
        }}
      />
      {/* <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity> */}
      
      <Text style={styles.heading}>Progress</Text>
      
      {/* Photos Section */}
      <Text style={styles.sectionTitle}>Photos</Text>
      <View style={styles.photosContainer}>
        {photos.map((photo, index) => (
          <View key={index} style={styles.photoCard}>
            <Image source={{ uri: photo.uri }} style={styles.photo} />
            <Text style={styles.photoDate}>Date: {photo.date}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.addPhotoButton} onPress={addPhoto}>
          <View style={styles.addPhotoContainer}>
            <Text style={styles.addPhotoText}>+</Text>
            <Text style={styles.addPhotoLabel}>add photo</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Body Weight Tracking Section */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Body Weight Tracking</Text>
        <TouchableOpacity onPress={openWeightModal}>
          <Text style={styles.addWeightText}>add +</Text>
        </TouchableOpacity>
      </View>

      {/* Line Chart */}
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: [''],
            datasets: [
              {
                data: weights,
                color: () => `#77C4C6`, // Line color
                strokeWidth: 3, // Thickness of the line
              },
            ],
          }}
          width={Dimensions.get('window').width - 40} // Full width minus some padding
          height={220}
          chartConfig={{
            backgroundColor: '#FFF',
            backgroundGradientFrom: '#FFF',
            backgroundGradientTo: '#FFF',
            decimalPlaces: 1, // 1 decimal place
            color: () => `rgba(0, 0, 0, 0)`, // Black labels
            labelColor: () => `rgba(0, 0, 0, 0)`, // Black labels
            propsForDots: {
              r: '0', // Hide dots
            },
            propsForBackgroundLines: {
              strokeWidth: 0, // Hide grid lines
            },
            strokeWidth: 2,
          }}
          withDots={false}
          withShadow={false} // Disable shadow under the line
          fromZero={true} // Start y-axis from 0
          yAxisInterval={1} // Set y-axis interval for better data scaling
        />
        {/* Custom X and Y axis lines */}
        <View style={styles.yAxisLine} />
        <View style={styles.xAxisLine} />
      </View>

      <Pressable
              style={styles.continueButton}
              onPress={goToClientSteps}
            >
              <Text style={styles.buttonText}>See client's steps</Text>
      </Pressable>

      <Pressable
              style={styles.continueButton}
              onPress={goToClientNutrition}
            >
              <Text style={styles.buttonText}>See client's nutrition</Text>
      </Pressable>

      <Pressable
              style={styles.continueButton}
              onPress={goToClientWaterIntake}
            >
              <Text style={styles.buttonText}>See client's water intake</Text>
      </Pressable>
   


      {/* Modal for adding weight */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Weight</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your weight"
              keyboardType="numeric"
              value={inputWeight}
              onChangeText={setInputWeight}
            />
            <View style={styles.modalButtonRow}>
              <Button title="Submit" onPress={submitWeight} />
              <Button title="Cancel" onPress={closeModal} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#FFF',
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  heading: {
    fontFamily: 'Josefin Sans',
    fontSize: 40,
    fontWeight: '500',
    color: '#000',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Josefin Sans',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  photosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoCard: {
    marginRight: 10,
    alignItems: 'center',
  },
  photo: {
    width: 100,
    height: 100,
    backgroundColor: '#EEE',
    borderRadius: 10,
    marginBottom: 5,
  },
  photoDate: {
    fontSize: 12,
    color: '#9B9B9B',
  },
  addPhotoButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE',
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  addPhotoContainer: {
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 36,
    color: '#9B9B9B',
  },
  addPhotoLabel: {
    fontSize: 12,
    color: '#9B9B9B',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addWeightText: {
    fontSize: 18,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  chartContainer: {
    position: 'relative', // Allows positioning of the custom axis lines
    alignItems: 'center',
  },
  xAxisLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#000', // Solid black line
    width: Dimensions.get('window').width - 40,
    bottom: 0,
  },
  yAxisLine: {
    position: 'absolute',
    width: 2,
    backgroundColor: '#000', // Solid black line
    height: 220,
    left: 0,
  },
  continueButton: {
    backgroundColor: "#4B84C4",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: "auto",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
