import React, {useState} from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    TextInput,
    Image,
    ScrollView,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

import {Stack, useRouter} from 'expo-router';
import {Formik} from 'formik';

import {useTrainerOnboardingStore} from '@/hooks/onboarding/useTrainerOnboarding';
import {TrainerPersonalitySchema} from '@/schemas/onboarding/trainer';

import ImageUploader from '@/components/ImageUploader';
import {getUrl} from "aws-amplify/storage";

export default function Personality() {
    const router = useRouter();
    const {saveSchema} = useTrainerOnboardingStore();

    // Display photos uploaded
    const [photos, setPhotos] = useState<string[]>([]);
    const [presignedUrls, setPresignedUrls] = useState<string[]>([]);

    const handleContinue = async (values: any) => {
        const finalValues = {...values, profilePhotos: photos};
        await saveSchema('personality', finalValues);
        router.push('/onboarding/trainer/results');
    };

    const handleImageUpload = async (url: string) => {
        setPhotos((prevPhotos) => [...prevPhotos, url]);

        const preSignedUrlData = await getUrl({
            path: url,
            options: {
                validateObjectExistence: true
            },
        });
        const preSignedUrl = preSignedUrlData.url
        console.log(`Pre-signed URL data:`, preSignedUrlData);
        setPresignedUrls((prevUrls) => [...prevUrls, preSignedUrl.toString()]);
    };

    return (
        <Formik
            initialValues={{
                profilePhotos: [],
                quote: '',
                website: '',
                socials: '',
            }}
            validationSchema={TrainerPersonalitySchema}
            onSubmit={handleContinue}
        >
            {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => {
                return (
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

                            <Text style={styles.headline}>Personality</Text>
                            <Text style={styles.subheadline}>Make your profile stand out and attract more clients</Text>

                            {/* Quote Input */}
                            <View style={styles.inputWrapper}>
                                <Text style={styles.label}>Your one liner/favourite quote</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="“I only work with awesome people”"
                                    placeholderTextColor="#D9D9D9"
                                    onChangeText={handleChange('quote')}
                                    onBlur={handleBlur('quote')}
                                    value={values.quote}
                                />
                                {errors.quote && touched.quote && <Text style={styles.errorText}>{errors.quote}</Text>}
                            </View>

                            {/* Photos Section */}
                            <Text style={styles.label}>Add some photos to your profile to showcase your
                                personality</Text>
                            <View style={styles.photoSection}>
                                <ScrollView horizontal>
                                    {presignedUrls.map((photoUrl, index) => (
                                        <Image key={index} source={{uri: photoUrl}} style={styles.photo}/>
                                    ))}
                                    <ImageUploader route={'profile'} onUploadComplete={handleImageUpload}/>
                                </ScrollView>
                            </View>

                            {/* Website Input */}
                            <View style={styles.inputWrapper}>
                                <Text style={styles.label}>Website</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your URL (if you have one)"
                                    placeholderTextColor="#D9D9D9"
                                    onChangeText={handleChange('website')}
                                    onBlur={handleBlur('website')}
                                    value={values.website}
                                />
                                {errors.website && touched.website &&
                                    <Text style={styles.errorText}>{errors.website}</Text>}
                            </View>

                            {/* Socials Input */}
                            <View style={styles.inputWrapper}>
                                <Text style={styles.label}>Socials</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Add your socials handle here"
                                    placeholderTextColor="#D9D9D9"
                                    onChangeText={handleChange('socials')}
                                    onBlur={handleBlur('socials')}
                                    value={values.socials}
                                />
                                {errors.socials && touched.socials &&
                                    <Text style={styles.errorText}>{errors.socials}</Text>}
                            </View>

                            <Pressable style={styles.continueButton} onPress={() => handleSubmit()}>
                                <Text style={styles.continueButtonText}>Continue</Text>
                            </Pressable>
                        </View>
                    </TouchableWithoutFeedback>
                )
            }}
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
    photoSection: {
        flexDirection: 'row',
        marginBottom: 20,
        width: '100%',
        height: 140,
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
