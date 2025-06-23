import React from 'react';
import {View, Text, Pressable, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback} from 'react-native';

import {Stack, useRouter} from 'expo-router';
import {Formik} from 'formik';

import {useTrainerOnboardingStore} from '@/hooks/onboarding/useTrainerOnboarding';
import {TrainerLocationSchema} from '@/schemas/onboarding/trainer';

export default function Location() {
    const router = useRouter();
    const {saveSchema} = useTrainerOnboardingStore();

    const handleContinue = async (values: any) => {
        await saveSchema('location', values);
        router.push('/onboarding/trainer/about-you');
    };

    return (
        <Formik
            initialValues={{
                suburb: '',
                gym: '',
            }}
            validationSchema={TrainerLocationSchema}
            onSubmit={handleContinue}
        >
            {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
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

                        <Text style={styles.headline}>Location</Text>
                        <Text style={styles.subheadline}>We'll match you with your ideal clients</Text>

                        {/* Suburb Input */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Select your suburb</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Start typing your suburb"
                                onChangeText={handleChange('suburb')}
                                onBlur={handleBlur('suburb')}
                                value={values.suburb}
                            />
                            {touched.suburb && errors.suburb && (
                                <Text style={styles.errorText}>{errors.suburb}</Text>
                            )}
                        </View>

                        {/* Gym Input */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Select your gym</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Search for your gym"
                                onChangeText={handleChange('gym')}
                                onBlur={handleBlur('gym')}
                                value={values.gym}
                            />
                            {touched.gym && errors.gym && (
                                <Text style={styles.errorText}>{errors.gym}</Text>
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
    inputWrapper: {
        marginBottom: 20,
        width: '100%',
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
