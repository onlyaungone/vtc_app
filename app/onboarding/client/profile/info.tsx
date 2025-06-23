import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    SafeAreaView,
    TextInput,
    ScrollView,
    Image, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Dimensions,
} from "react-native";

import {useRouter, Stack, useLocalSearchParams} from "expo-router";
import {Formik} from "formik";
import {useClientOnboarding} from "@/hooks/onboarding/useClientOnboarding";
import {ClientProfileSchema} from "@/schemas/onboarding/client";
import ImageUploader from "@/components/ImageUploader";
import {getUrl} from "aws-amplify/storage";
import {fetchUserAttributes} from "aws-amplify/auth";

export default function ClientProfile() {
    const router = useRouter();
    const schemaHandler = useClientOnboarding();
    const {gender} = useLocalSearchParams();

    // Display photos uploaded
    const [photos, setPhotos] = useState<string[]>([]);
    const [presignedUrls, setPresignedUrls] = useState<string[]>([])
    const [calculatedAge, setCalculatedAge] = useState<string>("");

    const saveAndGoToNextPage = async (values: any) => {
        const para = {
            age: values.age,
            gender: gender,
            bio: values.bio,
        };
        await schemaHandler.saveSchema("profile", values);
        router.push({
            pathname: "/onboarding/client/profile/goals",
            params: para,
        });
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
        setPresignedUrls((prevUrls) => [...prevUrls, preSignedUrl.toString()]);
    };

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
            }
        } catch (err) {
            console.error("Failed to fetch user's birthday", err);
        }
    }

    useEffect(() => {
        calculateUserAge()
    }, []);

    return (
        <Formik
            initialValues={{
                age: calculatedAge,
                bio: "",
                profilePhotos: [],
            }}
            enableReinitialize={true}
            validationSchema={ClientProfileSchema}
            onSubmit={saveAndGoToNextPage}
        >
            {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
              }) => (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <SafeAreaView style={styles.container}>
                            <Stack.Screen
                                options={{
                                    headerShown: true,
                                    headerTitle: "",
                                    headerBackVisible: false,
                                    headerTransparent: true,
                                    headerTintColor: "#D9D9D9",
                                }}
                            />
                            <ScrollView contentContainerStyle={styles.container}>
                                <KeyboardAvoidingView
                                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                                    keyboardVerticalOffset={200}
                                    style={styles.keyboardAvoidingView}
                                >
                                <Text style={styles.title}>Create your profile</Text>
                                <Text style={styles.subTitle}>Add some info</Text>

                                <Text style={styles.label}>Your age</Text>
                                <View style={styles.pickerContainer}>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: "#E0E0E0" }]}
                                        placeholder="How old are you?"
                                        value={values.age}
                                        editable={false}  // Make it read-only
                                        selectTextOnFocus={false}
                                    />
                                </View>
                                {errors.age && touched.age && (
                                    <Text style={styles.errorText}>{errors.age}</Text>
                                )}

                                <Text style={styles.label}>Tell us about yourself</Text>
                                <View style={styles.pickerContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Write a short bio here"
                                        value={values.bio}
                                        onChangeText={handleChange("bio")}
                                        onBlur={handleBlur("bio")}
                                    />
                                </View>
                                {errors.bio && touched.bio && (
                                    <Text style={styles.errorText}>{errors.bio}</Text>
                                )}

                                <Text style={styles.label}>Add a profile photo</Text>
                                <View style={styles.photoSection}>
                                    <ScrollView horizontal>
                                        {presignedUrls.map((photoUrl, index) => (
                                            <Image key={index} source={{uri: photoUrl}} style={styles.photo}/>
                                        ))}

                                        {/* Change the route to where it needs to uploaded to */}
                                        <ImageUploader
                                            route={"profile"}
                                            onUploadComplete={handleImageUpload}
                                        />
                                    </ScrollView>
                                </View>
                                {errors.profilePhotos && touched.profilePhotos && (
                                    <Text style={styles.errorText}>{errors.profilePhotos}</Text>
                                )}
                                <Pressable
                                    style={styles.continueButton}
                                    onPress={() => handleSubmit()}
                                >
                                    <Text style={styles.buttonText}>Continue</Text>
                                </Pressable>
                                </KeyboardAvoidingView>
                            </ScrollView>
                        </SafeAreaView>
                </TouchableWithoutFeedback>
            )}
        </Formik>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "left",
        color: "#000000",
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 16,
        textAlign: "left",
        color: "#A9A9A9",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333333",
        marginBottom: 10,
        marginTop: 10,
    },
    pickerContainer: {
        marginBottom: 10,
        width: "100%",
    },
    input: {
        backgroundColor: "#F4F6F9",
        borderRadius: 7,
        padding: 15,
        borderColor: "#D9D9D9",
        borderWidth: 1,
        width: "100%",
        zIndex: -1,
    },
    continueButton: {
        backgroundColor: "#4B84C4",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        alignItems: "center",
        width: "100%",
        marginTop: "auto",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        fontSize: 16,
        marginBottom: 20,
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginRight: 10,
    },
    photoSection: {
        flexDirection: "row",
        marginBottom: 20,
        width: "100%",
    },
});
