import React, {useState} from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    TextInput,
    ScrollView,
    Image,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

import {Stack, useRouter} from 'expo-router';
import {Formik} from 'formik';

import {useTrainerOnboardingStore} from '@/hooks/onboarding/useTrainerOnboarding';
import {TrainerResultsSchema} from '@/schemas/onboarding/trainer';

import ImageUploader from '@/components/ImageUploader';
import {getUrl} from "aws-amplify/storage";

export default function Results() {
    const router = useRouter();
    const schemaHandler = useTrainerOnboardingStore();

    const [resultsPhotos, setResultsPhotos] = useState<string[]>([]);
    const [presignedUrls, setPresignedUrls] = useState<string[]>([]);

    const handleContinue = async (values: any) => {
        const finalValues = {...values, resultsPhotos};
        await schemaHandler.saveSchema('results', finalValues);
        router.push('/onboarding/trainer/qualifications');
    };

    const handleImageUpload = async (url: string) => {
        setResultsPhotos((prevPhotos) => [...prevPhotos, url]);

        const preSignedUrlData = await getUrl({
            path: url,
            options: {
                validateObjectExistence: true
            },
        });
        const preSignedUrl = preSignedUrlData.url
        setPresignedUrls((prevUrls) => [...prevUrls, preSignedUrl.toString()]);
    };

    return (
        <Formik
            initialValues={{
                resultsPhotos: [],
                testimonials: '',
            }}
            validationSchema={TrainerResultsSchema}
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

                        <Text style={styles.headline}>Results</Text>
                        <Text style={styles.subheadline}>Showcase your results & client testimonials</Text>

                        {/* Testimonials */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Add your client testimonials</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="“this trainer is awesome!”"
                                placeholderTextColor="#D9D9D9"
                                onChangeText={handleChange('testimonials')}
                                onBlur={handleBlur('testimonials')}
                                value={values.testimonials}
                            />
                            {errors.testimonials && touched.testimonials && (
                                <Text style={styles.errorText}>{errors.testimonials}</Text>
                            )}
                        </View>

                        {/* Photos Section */}
                        <Text style={styles.label}>Add some client results photos to your profile</Text>
                        <ScrollView horizontal style={styles.photoSection}>
                            {presignedUrls.map((url, index) => (
                                <Image key={index} source={{uri: url}} style={styles.photo}/>
                            ))}
                            <ImageUploader route='testimonials' onUploadComplete={handleImageUpload}/>
                        </ScrollView>

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
        color: '#333333',
        marginBottom: 5,
    },
    subheadline: {
        fontSize: 14,
        color: '#A9A9A9',
        marginBottom: 20,
    },
    inputWrapper: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333333',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#F4F6F9',
        borderRadius: 7,
        padding: 15,
        borderColor: '#D9D9D9',
        borderWidth: 1,
    },
    addAnother: {
        color: '#4B84C4',
        marginTop: 10,
    },
    photoSection: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginRight: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
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
    },
});
