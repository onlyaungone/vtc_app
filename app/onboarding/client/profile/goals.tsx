import React, {useState} from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Modal,
    TextInput,
    ScrollView,
    SafeAreaView
} from "react-native";
import {useRouter, Stack, useLocalSearchParams} from "expo-router";
import {Formik} from "formik";
import {useClientOnboarding} from "@/hooks/onboarding/useClientOnboarding";
import {ClientDetailSchema} from "@/schemas/onboarding/client";
import {Days, Goal} from "@/schemas/onboarding/client/details";


export default function ClientDetails() {
    const router = useRouter();
    const schemaHandler = useClientOnboarding();
    const {age, gender, bio} = useLocalSearchParams();

    const [availableDays, setAvailableDays] = useState<Array<Days>>([]);
    const [goals, setGoals] = useState<Array<Goal>>([]);
    const [modalVisible, setModalVisible] = useState(false);

    const saveAndGoToNextPage = async (values: any) => {
        const para = {
            age: age,
            goals: goals,
            availableDays: availableDays,
            gender: gender,
            bio: bio,
        };
        console.log("Form values:", values);
        await schemaHandler.saveSchema("details", values);
        router.push({
            pathname: "/onboarding/client/profile/preference",
            params: para,
        });
    };

    const handleDaySelection = (
        day: Days,
        setFieldValue: (field: string, value: any) => void
    ) => {
        let newAvailableDays = availableDays;
        if (newAvailableDays.includes(day)) {
            newAvailableDays = newAvailableDays.filter((d) => d !== day);
        } else {
            newAvailableDays = [...newAvailableDays, day];
        }
        setAvailableDays(newAvailableDays);
        setFieldValue("availableDays", newAvailableDays);
    };

    const handleGoalSelect = (
        goal: Goal,
        setFieldValue: (field: string, value: any) => void
    ) => {
        const newGoals = [...goals, goal];
        setGoals(newGoals);
        setFieldValue("goals", newGoals);
        setModalVisible(false);
    };

    const handleGoalRemove = (
        goal: Goal,
        setFieldValue: (field: string, value: any) => void
    ) => {
        const updatedGoals = goals.filter((g) => g !== goal);
        setGoals(updatedGoals);
        setFieldValue("goals", updatedGoals);
    };

    return (
        <Formik
            initialValues={{
                availableDays: [] as Days[],
                goals: [] as Goal[],
            }}
            validationSchema={ClientDetailSchema}
            onSubmit={saveAndGoToNextPage}
        >
            {({handleSubmit, values, errors, touched, setFieldValue}) => (
                <View style={styles.container}>
                    <Stack.Screen
                        options={{
                            headerShown: true,
                            headerTitle: "",
                            headerBackVisible: false,
                            headerTransparent: true,
                            headerTintColor: "#D9D9D9",
                        }}
                    />
                    <Text style={styles.title}>More details</Text>
                    <Text style={styles.subTitle}>Add more detail</Text>

                    {/* Days Selection */}
                    <Text style={styles.label}>What days are you available?</Text>
                    <View style={styles.daysContainer}>
                        {Object.values(Days).map((day, index) => (
                            <Pressable
                                key={index}
                                style={[
                                    styles.dayCircle,
                                    values.availableDays.includes(day) &&
                                    styles.dayCircleSelected,
                                ]}
                                onPress={() => handleDaySelection(day as Days, setFieldValue)}
                            >
                                <Text
                                    style={[
                                        styles.dayText,
                                        values.availableDays.includes(day) &&
                                        styles.dayTextSelected,
                                    ]}
                                >
                                    {day}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                    {touched.availableDays && errors.availableDays && (
                        <Text style={styles.errorText}>{errors.availableDays}</Text>
                    )}
                    {/* Goals Selection */}
                    <Text style={styles.label}>Your main goals</Text>

                    {/* Display the first goal in the TextInput style */}
                    {goals.length > 0 ? (
                        <View style={styles.pickerContainer}>
                            <TextInput
                                style={styles.input}
                                value={goals[0]} // First goal displayed here
                                editable={false}
                                pointerEvents="none"
                            />
                            <Pressable
                                onPress={() => handleGoalRemove(goals[0], setFieldValue)}
                            >
                                <Text style={styles.removeText}> X </Text>
                            </Pressable>
                        </View>
                    ) : (
                        // Show TextInput placeholder if no goals selected
                        <Pressable
                            onPress={() => setModalVisible(true)}
                            style={styles.pickerContainer}
                        >
                            <TextInput
                                style={styles.input}
                                placeholder="Select your main goals"
                                editable={false}
                                pointerEvents="none"
                            />
                        </Pressable>
                    )}

                    {/* Display remaining goals styled the same as TextInput */}
                    <View style={styles.goalWrapper}>
                        {goals.slice(1).map((goal, index) => (
                            <View key={index} style={styles.pickerContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={goal} // Extra goals displayed here
                                    editable={false}
                                    pointerEvents="none"
                                />
                                <Pressable
                                    onPress={() => handleGoalRemove(goal, setFieldValue)}
                                >
                                    <Text style={styles.removeText}> X </Text>
                                </Pressable>
                            </View>
                        ))}

                        {/* Button to add more goals, visible only if at least one goal is selected */}
                        {goals.length > 0 && (
                            <Pressable
                                onPress={() => setModalVisible(true)}
                                style={styles.addGoalButton}
                            >
                                <Text style={styles.addGoalText}>add another +</Text>
                            </Pressable>
                        )}
                    </View>

                    {/* Error handling */}
                    {touched.goals && errors.goals && (
                        <Text style={styles.errorText}>{errors.goals}</Text>
                    )}

                    <Modal
                        transparent={true}
                        visible={modalVisible}
                        animationType="slide"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <ScrollView>
                                    {Object.values(Goal).map((goal, index) => (
                                        <Pressable
                                            key={index}
                                            style={styles.optionButton}
                                            onPress={() => {
                                                handleGoalSelect(goal as Goal, setFieldValue);
                                                setModalVisible(false); // Close modal after selection
                                            }}
                                        >
                                            <Text style={styles.optionText}>{String(goal)}</Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                                <Pressable
                                    style={styles.closeButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>

                    <Pressable
                        style={styles.continueButton}
                        onPress={() => handleSubmit()}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </Pressable>
                </View>
            )}
        </Formik>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingVertical: 50,
        paddingHorizontal: 20,
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
    },
    pickerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        width: "100%",
    },
    input: {
        flex: 1,
        backgroundColor: "#F4F6F9",
        borderRadius: 7,
        padding: 15,
        borderColor: "#D9D9D9",
        borderWidth: 1,
        width: "100%",
        zIndex: -1,
    },
    daysContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    dayCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "transparent",
        borderColor: "#4B84C4",
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
    },
    dayCircleSelected: {
        backgroundColor: "#4B84C4",
    },
    dayText: {
        color: "#4B84C4",
        fontSize: 16,
    },
    dayTextSelected: {
        color: "#FFFFFF",
    },
    goalWrapper: {
        marginVertical: 10,
    },
    goalBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F4F6F9",
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
    },
    goalText: {
        fontSize: 16,
        color: "#000",
    },
    removeText: {
        fontSize: 14,
        color: "#FF6347",
        marginLeft: 10,
    },
    addGoalButton: {
        marginTop: 10,
    },
    addGoalText: {
        color: "#9B9B9B",
        fontSize: 16,
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
});
