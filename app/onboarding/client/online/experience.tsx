import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  Switch,
  Modal,
} from "react-native";

import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";

import { useClientOnboarding } from "@/hooks/onboarding/useClientOnboarding";
import { ClientExperienceSchema } from "@/schemas/onboarding/client"; // Import the validation schema
import { TrainingStyle,Education} from "@/schemas/onboarding/client/experience"; // Import the enums
import {Goal,Days} from "@/schemas/onboarding/client/details";
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Buffer } from 'buffer';
import * as Crypto from 'expo-crypto';
import {fetchUserAttributes} from "aws-amplify/auth";
import {useAuth} from "@/context/AuthContext";

const TABLE = 'OnlineClient-ycmuiolpezdtdkkxmiwibhh6e4-staging';

export default function OnlineClientTrainingPreferences() {
  const router = useRouter();
  const schemaHandler = useClientOnboarding();
  const { user } = useAuth();
  const { age, goals, availableDays, gender, trainerAge, trainerGender, bio} = useLocalSearchParams();
  global.Buffer = global.Buffer || Buffer;

  // Modal control
  const [modalVisibleTraining, setModalVisibleTraining] = useState(false);
  const [modalVisibleEducation, setModalVisibleEducation] = useState(false);

  const client = new DynamoDBClient({
    region: process.env.EXPO_PUBLIC_AWS_REGION || 'ap-southeast-2',
    credentials: {
      accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
    },
  });

  // Function to save data to DynamoDB
  const saveItemToDynamoDB = async (item: {
    id: any; name: any; age: any; sub: any;  __typename: any, gender: any, availability: any, goals: any, trainerAge: any, trainerGender: any, trainerEducation: any, trainerExperience:any, niche: any, bio: any
    }) => {
    try {
      const params = {
        TableName: TABLE,
        Item: {
          id: { S: item.id }, // S means String type in DynamoDB
          name: { S: item.name },
          age: { N: item.age.toString() }, // DynamoDB requires number types to be strings
          sub: { S: item.sub },
          __typename: { S: item.__typename },
          gender: { S: item.gender },
          // Ensure availability is an array and format it correctly for DynamoDB
          availability: {
            L: Array.isArray(item.availability)
              ? item.availability.map((day: any) => ({ S: day }))
              : typeof item.availability === 'string'
                ? item.availability.split(',').map((day: any) => ({ S: day.trim() })) // Split string by commas
                : [] // Fallback to empty array if undefined or not an array/string
          },
          goals: {
            L: Array.isArray(item.goals)
              ? item.goals.map((go: any) => ({ S: go }))
              : typeof item.goals === 'string'
                ? item.goals.split(',').map((go: any) => ({ S: go.trim() })) // Split string by commas if it's a string
                : [] // Fallback to empty array if not an array or string
          },
          // Conditionally add bio only if it exists
          trainerAge: item.trainerAge ? { N: item.trainerAge.toString() } : { N: '-1' },
          ...(item.trainerGender ? { trainerGender: { S: item.trainerGender } } : { trainerGender: { S: "Not Important" } }), // Use "Not Important" if it doesn't matter
          ...(item.trainerEducation ? { trainerEducation: { S: item.trainerEducation } } : {trainerEducation: { S:  "Not Important"}}), // Use "Not Important" if it doesn't matter
          trainerExperience:item.trainerExperience ? { N: item.trainerExperience.toString() } : { N: '-1' },
          niche: { S: item.niche },
          ...(item.bio && { bio: { S: item.bio } })

        },
     };

      const command = new PutItemCommand(params);
      const result = await client.send(command);

      console.log('Data saved successfully:', result);
    } catch (error) {
      console.error('Error saving data to DynamoDB:', error);
      Alert.alert('Error', 'Failed to save data to DynamoDB.');
    }
  };

  // Fetch client details and save them to DynamoDB
  const fetchClientDetails = async (values: any) => {
    try {
      const attributes = await fetchUserAttributes();
      const name = attributes['custom:fullName']

      // Handle goals: convert the values to keys
    const goalsArray = Array.isArray(goals) ? goals : goals.split(',').map(goal => goal.trim());
    const goalsAsKeys = goalsArray.map((goal: string) =>
      Object.keys(Goal).find((key) => Goal[key as keyof typeof Goal] === goal)
    );

    // Handle availableDays: convert the values to keys
    const availableDaysArray = Array.isArray(availableDays)
      ? availableDays
      : availableDays.split(',').map(day => day.trim());

    const availableDaysAsKeys = availableDaysArray.map((day: string) =>
      Object.keys(Days).find((key) => Days[key as keyof typeof Days] === day)
    );

      // Example item to be saved
      const newItem = {
        id: Crypto.randomUUID() ,
        name: name || 'Unknown',
        age: age || 0,
        sub: user,
        __typename: "Online",
        gender: gender,
        availability: availableDaysAsKeys,
        goals: goalsAsKeys,
        trainerAge: trainerAge,
        trainerGender: trainerGender,
        trainerEducation: Object.keys(Education).find((key) => Education[key as keyof typeof Education] === values.educationLevel),
        trainerExperience: values.experienceLevel,
        niche: Object.keys(TrainingStyle).find((key) => TrainingStyle[key as keyof typeof TrainingStyle] === values.trainingStyle),
        bio: bio
      };
      console.log(newItem)
      // Call the save function to save the new item
      await saveItemToDynamoDB(newItem);


    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };


  const handleSubmit = async (values: any) => {
    await fetchClientDetails(values);

    await schemaHandler.saveSchema("experience", values);
    router.push("/onboarding/client/online/match");
  };

  return (
    <Formik
      initialValues={{
        experienceLevel: "",
        educationLevel: "",
        trainingStyle: "",
        experienceMatters: true,
        educationMatters: true,
      }}
      validationSchema={ClientExperienceSchema} // Apply the validation schema
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
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
          <ScrollView contentContainerStyle={styles.contentContainer}>

            <Text style={styles.title}>Your Trainer</Text>
            <Text style={styles.subTitle}>
              What are you looking for in your trainer?
            </Text>

            <Text style={styles.label}>Experience level (years)</Text>
            <View style={styles.pickerContainer}>
              <TextInput
                style={styles.input}
                placeholder="Select PT experience"
                value={values.experienceMatters ? 'Not Important' : values.experienceLevel}
                onChangeText={handleChange("experienceLevel")}
                onBlur={handleBlur("experienceLevel")}
                keyboardType="numeric"
                editable={!values.experienceMatters}
              />
            </View>
            {touched.experienceLevel && errors.experienceLevel && (
              <Text style={styles.errorText}>{errors.experienceLevel}</Text>
            )}

            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceText}>It doesn’t matter</Text>
              <Switch
                value={values.experienceMatters}
                onValueChange={async (val) => {
                  await setFieldValue("experienceMatters", val);
                  if (!val) {
                    await setFieldValue("experienceLevel", ""); // Clear experience level if it doesn't matter
                  }
                }}
                style={styles.switch}
                trackColor={{ false: "#767577", true: "#4B84C4" }}
              />
            </View>

            <Text style={styles.label}>Education level</Text>
            <Pressable
              onPress={() =>
                !values.educationMatters && setModalVisibleEducation(true)
              } // Disable modal trigger if education doesn't matter
              style={[styles.pickerContainer]} // Apply the disabled style when it doesn't matter
            >
              <TextInput
                style={styles.input}
                placeholder="Select PT education level"
                value={values.educationLevel} // Display the selected education level
                editable={values.educationMatters} // Disable TextInput when educationMatters is true
                pointerEvents="none"
              />
            </Pressable>

            {touched.educationLevel && errors.educationLevel && (
              <Text style={styles.errorText}>{errors.educationLevel}</Text>
            )}

            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceText}>It doesn’t matter</Text>
              <Switch
                value={values.educationMatters}
                onValueChange={async (val) => {
                  await setFieldValue("educationMatters", val);
                  if (!val) {
                    await setFieldValue("educationLevel", ""); // Clear education level when it doesn't matter
                  }
                }}
                style={styles.switch}
                trackColor={{ false: "#767577", true: "#4B84C4" }}
              />
            </View>

            <Text style={styles.label}>
              What kind of training are you into?
            </Text>
            <Pressable
              onPress={() => setModalVisibleTraining(true)}
              style={styles.pickerContainer}
            >
              <TextInput
                style={styles.input}
                placeholder="Select your niche"
                value={values.trainingStyle || ""} // Display the selected niche
                editable={false}
                pointerEvents="none"
              />
            </Pressable>
            {touched.trainingStyle && errors.trainingStyle && (
              <Text style={styles.errorText}>{errors.trainingStyle}</Text>
            )}

           {/* Modal for Training Style Selection */}
<Modal
  transparent={true}
  visible={modalVisibleTraining}
  animationType="slide"
  onRequestClose={() => setModalVisibleTraining(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <ScrollView>
        {Object.values(TrainingStyle).map((style, index) => (
          <Pressable
            key={index}
            style={styles.optionButton}
            onPress={async () => {
              await setFieldValue("trainingStyle", style);
              setModalVisibleTraining(false);
            }}
          >
            <Text style={styles.optionText}>{String(style)}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable
        style={styles.closeButton}
        onPress={() => setModalVisibleTraining(false)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </Pressable>
    </View>
  </View>
</Modal>

{/* Modal for Education Selection */}
<Modal
  transparent={true}
  visible={modalVisibleEducation}
  animationType="slide"
  onRequestClose={() => setModalVisibleEducation(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <ScrollView>
        {Object.values(Education).map((edu, index) => (
          <Pressable
            key={index}
            style={styles.optionButton}
            onPress={async () => {
              await setFieldValue("educationLevel", edu);
              setModalVisibleEducation(false);
            }}
          >
            <Text style={styles.optionText}>{String(edu)}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable
        style={styles.closeButton}
        onPress={() => setModalVisibleEducation(false)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </Pressable>
    </View>
  </View>
</Modal>

            {/* Submit Button */}
            <Pressable
              style={styles.continueButton}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontFamily: "Josefin Sans",
    fontSize: 40,
    fontWeight: "500",
    lineHeight: 50,
    letterSpacing: -0.32,
    color: "#000000",
    marginTop: 40,
    textAlign: "left",
  },
  subTitle: {
    fontFamily: "Josefin Sans",
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 21,
    letterSpacing: -0.32,
    color: "#9B9B9B",
    textAlign: "left",
    marginVertical: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: "400",
    fontFamily: "Josefin Sans",
    lineHeight: 21,
    letterSpacing: -0.32,
    color: "#000000",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "left",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#F4F6F9",
    borderRadius: 20,
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 18,
    fontFamily: "Josefin Sans",
    color: "#9B9B9B",
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 0,
  },
  preferenceText: {
    fontSize: 18,
    fontWeight: "400",
    fontFamily: "Josefin Sans",
    color: "#000000",
    textAlign: "left",
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  continueButton: {
    backgroundColor: "#4B84C4",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 80,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    height: "60%",
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  optionButton: {
    padding: 15,
    borderBottomColor: "#CCC",
    borderBottomWidth: 1,
    width: "100%",
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
  },
  closeButton: {
    backgroundColor: "#4B84C4",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
