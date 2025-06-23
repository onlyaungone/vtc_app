import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router'; // For navigation
import { LinearGradient } from 'expo-linear-gradient'; // For gradient button

const CreateProgram: React.FC = () => {
  const router = useRouter();
  const [programName, setProgramName] = useState('');

  // Function to handle continue action
  const handleContinue = () => {
    if (programName.trim()) {
      // Proceed with the program creation flow (e.g., navigate to the next screen)
      router.push({
        pathname:'/screen/Program/ProgramCreateDetail',
        params:{programName:programName.trim()}
      }); // Replace with your actual route
    } else {
      // You can show an error message or alert if the name is empty
      alert('Please enter a program name.');
    }
  };

  return (
    <View style={styles.container}>

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
        <TouchableOpacity onPress={() => router.back()}>
          {/* Back Button with Circle Background */}
          <View style={styles.circleBackground}>
            <Ionicons name="arrow-back" size={20} color="#333" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Program</Text>
      </View>

      {/* Program Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Program Name</Text>
        <TextInput
          style={styles.input}
          placeholder="eg. Program name 1"
          value={programName}
          onChangeText={setProgramName}
        />
      </View>

      {/* Continue Button with Gradient */}
      <TouchableOpacity onPress={handleContinue} style={styles.buttonContainer}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20, paddingTop: 50
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
  inputContainer: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 'auto', // Push the button to the bottom of the screen
    marginBottom: 30, // Add some margin at the bottom for spacing
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

export default CreateProgram;