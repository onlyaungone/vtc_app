import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import {Stack, useRouter} from 'expo-router';
import {Formik} from 'formik';

import {Days, aboutYou as TrainerAboutYouSchema} from '@/schemas/onboarding/trainer/about-you';
import {useTrainerOnboardingStore} from '@/hooks/onboarding/useTrainerOnboarding';

import {TrainerSpecialties} from '@/constants/TrainerInfo';
import {fetchUserAttributes} from "aws-amplify/auth";

export default function AboutYou() {
    const router = useRouter();
    const {saveSchema} = useTrainerOnboardingStore();
    const [availableDays, setAvailableDays] = useState<Array<Days>>([]);
    const [openSpecialties, setOpenSpecialties] = useState(false);
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
    const [specialtyItems, setSpecialtyItems] = useState(TrainerSpecialties);
    const [calculatedAge, setCalculatedAge] = useState<string>("");

    const handleContinue = async (values: any) => {
        await saveSchema('aboutYou', values);
        router.push('/onboarding/trainer/experience');
    };

    const handleDaySelection = (day: Days, setFieldValue: (field: string, value: any) => void) => {
        let newAvailableDays = availableDays;
        if (newAvailableDays.includes(day)) {
            newAvailableDays = newAvailableDays.filter(d => d !== day);
        } else {
            newAvailableDays = [...newAvailableDays, day];
        }
        setAvailableDays(newAvailableDays);
        setFieldValue('availableDays', newAvailableDays);
    };

    const dayToText = (day: Days): string => {
        return day.slice(0, 3);
    }

    const calculateUserAge = async () => {
        try {
            const attributes = await fetchUserAttributes();
            const birthday = attributes['custom:dateOfBirth']

            if (birthday) {
                const today = new Date();
                const birthDate = new Date(birthday);
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
                setCalculatedAge(age.toString());
                console.log('age: ' + age);
            }
        } catch (err) {
            console.error("Failed to fetch user's birthday", err);
        }
    }

    useEffect(() => {
        calculateUserAge()
    }, []);

    if (calculatedAge === "") {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <Formik
            initialValues={{
                availableDays: [] as Days[],
                trainingStyle: '',
                age: calculatedAge,
            }}
            enableReinitialize={true}
            validationSchema={TrainerAboutYouSchema}
            onSubmit={handleContinue}
        >
            {({handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue}) => (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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

                        <Text style={styles.headline}>About you</Text>
                        <Text style={styles.subheadline}>We'll match you with your ideal clients</Text>

                        <Text style={styles.label}>What days are you available?</Text>
                        <View style={styles.daysContainer}>
                            {Object.values(Days).map((day, index) => (
                                <Pressable
                                    key={index}
                                    style={[
                                        styles.dayCircle,
                                        values.availableDays.includes(day) && styles.dayCircleSelected,
                                    ]}
                                    onPress={() => handleDaySelection(day as Days, setFieldValue)}
                                >
                                    <Text
                                        style={[
                                            styles.dayText,
                                            values.availableDays.includes(day) && styles.dayTextSelected,
                                        ]}
                                    >
                                        {dayToText(day)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                        {touched.availableDays && errors.availableDays && (
                            <Text style={styles.errorText}>{errors.availableDays}</Text>
                        )}

                        <View style={[styles.inputWrapper, openSpecialties ? {
                            zIndex: 1000,
                            elevation: 10
                        } : {zIndex: 1}]}>
                            <Text style={styles.label}>Training style/Specialties</Text>
                            <DropDownPicker
                                open={openSpecialties}
                                value={selectedSpecialty}
                                items={specialtyItems}
                                setOpen={setOpenSpecialties}
                                setValue={async (callback: (currentValue: string | null) => string | null) => {
                                    const selectedValue = callback(selectedSpecialty);
                                    setSelectedSpecialty(selectedValue);
                                    await setFieldValue('trainingStyle', selectedValue);
                                }}
                                setItems={setSpecialtyItems}
                                placeholder="Select your training/coaching type"
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />
                            {touched.trainingStyle && errors.trainingStyle && (
                                <Text style={styles.errorText}>{errors.trainingStyle}</Text>
                            )}
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Your age</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: "#E0E0E0" }]}
                                placeholder="How old are you?"
                                value={values.age}
                                editable={false}  // Make it read-only
                                selectTextOnFocus={false}
                            />
                            {touched.age && errors.age && (
                                <Text style={styles.errorText}>{errors.age}</Text>
                            )}
                        </View>

                        <Pressable style={styles.continueButton} onPress={() => handleSubmit()}>
                            <Text style={styles.continueButtonText}>Continue</Text>
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
        paddingTop: 60,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
    loadingText: {
        fontSize: 18,
        color: "#4B84C4",
    },
    headline: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#000000',
        marginBottom: 10,
    },
    subheadline: {
        fontSize: 16,
        textAlign: 'left',
        color: '#A9A9A9',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333333',
        marginBottom: 10,
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    dayCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'transparent',
        borderColor: '#4B84C4',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    dayCircleSelected: {
        backgroundColor: '#4B84C4',
    },
    dayText: {
        color: '#4B84C4',
        fontSize: 14,
    },
    dayTextSelected: {
        color: '#FFFFFF',
    },
    inputWrapper: {
        marginBottom: 30,
        width: '100%',
    },
    dropdown: {
        backgroundColor: '#F4F6F9',
        borderColor: '#D9D9D9',
    },
    dropdownContainer: {
        backgroundColor: '#F4F6F9',
        borderColor: '#D9D9D9',
        zIndex: 999,
    },
    input: {
        backgroundColor: '#F4F6F9',
        borderRadius: 7,
        padding: 15,
        borderColor: '#D9D9D9',
        borderWidth: 1,
        width: '100%',
    },
    continueButton: {
        backgroundColor: '#4B84C4',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        alignItems: 'center',
        width: '100%',
        marginTop: 'auto',
    },
    continueButtonText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
});
