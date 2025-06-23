import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, StyleSheet, TextInput, Alert, Keyboard, TouchableWithoutFeedback} from 'react-native';
import {useLocalSearchParams, useRouter, Stack} from 'expo-router';
import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb';
import {Buffer} from 'buffer';
import {Goal, Days} from "@/schemas/onboarding/client/details";
import * as Crypto from 'expo-crypto';

import {Formik} from 'formik';

import {useClientOnboarding} from '@/hooks/onboarding/useClientOnboarding';
import {ClientLocationSchema} from '@/schemas/onboarding/client';
import {useAuth} from "@/context/AuthContext";
import {fetchUserAttributes} from "aws-amplify/auth";

const TABLE = 'InPersonClient-ycmuiolpezdtdkkxmiwibhh6e4-staging'; // Replace with your DynamoDB table name

export default function InPersonClientLocation() {
    const router = useRouter();
    const schemaHandler = useClientOnboarding();
    const {user} = useAuth();

    global.Buffer = global.Buffer || Buffer;
    // State variables for client details

    const {age, goals, availableDays, gender, bio} = useLocalSearchParams(); // Get parameters passed from previous screen

    const client = new DynamoDBClient({
        region: process.env.EXPO_PUBLIC_AWS_REGION || 'ap-southeast-2',
        credentials: {
            accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
        },
    });


    // Function to save data to DynamoDB
    const saveItemToDynamoDB = async (item: {
        id: any;
        name: any;
        age: any;
        location: any;
        gymLocation: any;
        sub: any;
        isApproved: any;
        __typename: any,
        gender: any,
        availability: any,
        goals: any,
        bio: any
    }) => {
        try {
            console.log('Availability (stringified):', JSON.stringify(item.availability, null, 2));
            const params = {
                TableName: TABLE,
                Item: {
                    id: {S: item.id || "default-id"}, // Ensure id is provided or give a default value
                    name: {S: item.name || "Unknown"}, // Provide default value for name if undefined
                    age: {N: item.age ? item.age.toString() : "0"}, // Ensure age is a number or provide a default
                    location: {S: item.location || "Unknown"}, // Default for location
                    gymLocation: {S: item.gymLocation || "Unknown"}, // Default for gymLocation
                    isApproved: {BOOL: item.isApproved !== undefined ? item.isApproved : false}, // Default for isApproved
                    sub: {S: item.sub || "Unknown"}, // Default for sub
                    __typename: {S: item.__typename || "Unknown"}, // Default for __typename
                    gender: {S: item.gender || "Unknown"}, // Default for gender
                    availability: {
                        L: Array.isArray(item.availability)
                            ? item.availability.map((day: any) => ({S: day}))
                            : typeof item.availability === 'string'
                                ? item.availability.split(',').map((day: any) => ({S: day.trim()})) // Split string by commas
                                : [] // Fallback to empty array if undefined or not an array/string
                    },
                    goals: {
                        L: Array.isArray(item.goals)
                            ? item.goals.map((go: any) => ({S: go}))
                            : typeof item.goals === 'string'
                                ? item.goals.split(',').map((go: any) => ({S: go.trim()})) // Split string by commas if it's a string
                                : [] // Fallback to empty array if not an array or string
                    },
                    // Conditionally add bio only if it exists
                    ...(item.bio && {bio: {S: item.bio}})
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
    const fetchClientDetails = async (values: { suburb: string; gym: string; }) => {
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
                id: Crypto.randomUUID(),
                name: name || 'Unknown',
                age: age || 0,
                location: values.suburb || 'Unknown',
                gymLocation: values.gym || 'Unknown',
                sub: user,
                isApproved: true,
                __typename: "InPersonClient",
                gender: gender,
                availability: availableDaysAsKeys,
                goals: goalsAsKeys,
                bio: bio
            };

            // Call the save function to save the new item
            await saveItemToDynamoDB(newItem);

            router.push('/onboarding/client/inPerson/matchLocation'); // Navigate to trainers list screen

        } catch (error) {
            console.error('Error fetching client details:', error);
        }
    };

    // Might be useful for when the geo location logic is set

    // const handleLocationSelect = (details: any) => {
    //   const { lat, lng } = details.geometry.location;
    //   const locationString = `${lat},${lng}`;
    //   setLocation(locationString);
    //   console.log('Client location:', locationString);
    // };

    // const handleGymLocationSelect = (details: any) => {
    //   setGymLocation(details.formatted_address);
    //   console.log(details.formatted_address);
    // };

    const handleSubmit = async (values: any) => {
        await fetchClientDetails(values);

        await schemaHandler.saveSchema("location", values);
        router.push('/onboarding/client/inPerson/matchLocation'); // Navigate to trainers list screen
    };


    const goToHomeScreen = () => {
        router.push('/clientHome/home');
    }

    return (

        <Formik
            initialValues={{
                suburb: '',
                gym: '',
            }}
            validationSchema={ClientLocationSchema}
            onSubmit={handleSubmit}
        >

            {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.container}>
                        <Stack.Screen
                            options={{
                                headerShown: true,
                                headerTitle: 'Location',
                                headerBackVisible: false,
                                headerTransparent: true,
                                headerTintColor: '#D9D9D9',
                            }}
                        />

                        <Text style={styles.title}>Location</Text>

                        {/* Suburb Input */}

                        <Text style={styles.label}>Select your suburb</Text>
                        <View style={styles.pickerContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Start typing your suburb"
                                onChangeText={handleChange('suburb')}
                                onBlur={handleBlur('suburb')}
                                value={values.suburb}
                            />
                        </View>

                        {touched.suburb && errors.suburb && (
                            <Text style={styles.errorText}>{errors.suburb}</Text>
                        )}


                        {/* Gym Input */}

                        <Text style={styles.label}>Select your gym</Text>
                        <View style={styles.pickerContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Search for your gym"
                                onChangeText={handleChange('gym')}
                                onBlur={handleBlur('gym')}
                                value={values.gym}
                            />
                        </View>
                        {touched.gym && errors.gym && (
                            <Text style={styles.errorText}>{errors.gym}</Text>
                        )}


                        {/* Submit Button */}
                        <Pressable
                            style={styles.continueButton}
                            onPress={() => handleSubmit()}
                        >
                            <Text style={styles.buttonText}>Find my trainer!</Text>
                        </Pressable>

                        {/* "Find a trainer later" button styled as a link */}
                        <Pressable onPress={goToHomeScreen}>
                            <Text style={styles.linkText}>Find a trainer later</Text>
                        </Pressable>
                    </View>
                </TouchableWithoutFeedback>
            )}
        </Formik>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        position: 'absolute',
        width: 32,
        height: 32,
        left: 5,
        top: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#000000',
        fontSize: 24,
    },
    title: {
        fontFamily: 'Josefin Sans',
        fontSize: 40,
        fontWeight: '500',
        lineHeight: 50,
        letterSpacing: -0.32,
        color: '#000000',
        marginTop: 70,
        marginLeft: 10, // Adjusted for alignment
    },
    label: {
        fontSize: 18,
        fontWeight: '400',
        fontFamily: 'Josefin Sans',
        lineHeight: 21,
        letterSpacing: -0.32,
        color: '#000000',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 10, // Adjusted for alignment
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F6F9',
        borderRadius: 20,
        marginBottom: 20,
        marginHorizontal: 10, // Aligns picker with title and labels
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 18,
        fontFamily: 'Josefin Sans',
        color: '#9B9B9B',
    },
    linkText: {
        color: '#000000',
        fontSize: 16,
        textDecorationLine: 'underline',
        textAlign: 'center',
        marginTop: 15,
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
        fontSize: 12,
        marginTop: 5,
    },
});


