import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';

import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';


import { ClientAvailabilitySchema } from '@/schemas/onboarding/client';
import { useClientOnboarding } from '@/hooks/onboarding/useClientOnboarding';
import { LinearGradient } from 'expo-linear-gradient';

export default function OnlineClientTrainingPreferences() {
  const router = useRouter();
  const schemaHandler = useClientOnboarding();

  const [ageRangeMatters, setAgeRangeMatters] = useState(true);
  const [genderMatters, setGenderMatters] = useState(true);
  const [trainerGender, setTrainerGender] = useState<string | null>(null);
  const { age, goals, availableDays, gender, bio} = useLocalSearchParams();

  const saveAndGoToNextPage = async (values: any) => {
    await schemaHandler.saveSchema('availability', values);
    const para = {
      age: age,
      goals: goals,
      availableDays: availableDays,
      gender: gender,
      trainerAge: values.trainerAge,
      trainerGender: values.trainerGender,
      bio: bio
    };
    router.push({
      pathname: '/onboarding/client/online/experience',
      params: para
    });
  };

  return (
    <Formik
      initialValues={{
        trainerAge: '',
        trainerGender: '',
        ageRangeMatters,
        genderMatters,
      }}
      validationSchema={ClientAvailabilitySchema}
      onSubmit={saveAndGoToNextPage}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
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

            <Text style={styles.title}>Find your trainer</Text>
            <Text style={styles.subTitle}>What are you looking for in your trainer?</Text>

            {/* Age Range Section */}
            <Text style={styles.label}>Age range</Text>
            <View style={styles.pickerContainer}>
              <TextInput
                style={styles.input}
                placeholder="Select PT age range"
                value={values.trainerAge}
                onChangeText={handleChange('trainerAge')}
                onBlur={handleBlur('trainerAge')}
                keyboardType="numeric"
                editable={!ageRangeMatters}
              />
            </View>
            {touched.trainerAge && errors.trainerAge && <Text style={styles.errorText}>{errors.trainerAge}</Text>}

            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceText}>It doesn’t matter</Text>
              <Switch
                value={ageRangeMatters}
                onValueChange={async (val) => {
                  setAgeRangeMatters(val);
                  await setFieldValue('ageRangeMatters', val); // update formik field
                  if (val) {
                    await setFieldValue('trainerAge', ''); // Clear age when it doesn't matter
                  }
                }}
                style={styles.switch}
                trackColor={{ false: '#767577', true: '#4B84C4' }}
              />
            </View>

            {/* Gender Preference Section */}
            <Text style={styles.label}>Your preference</Text>
            <View style={styles.genderPreference}>
              {/* Male Button */}
              <TouchableOpacity
                onPress={async () => {
                  setTrainerGender('MALE');
                  await setFieldValue('trainerGender', 'MALE');
                }}
                disabled={genderMatters} // Disable selection when genderMatters is true (user doesn't care)
              >
                {trainerGender === 'MALE' ? (
                  <LinearGradient
                    colors={['#C44B9B', '#4B84C4']}
                    style={styles.genderButtonSelected}
                  >
                    <Text style={styles.selectedGenderIcon}>♂</Text>
                    <Text style={styles.selectedGenderText}>Male</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.genderButtonUnselected}>
                    {/* Apply gradient to border */}
                    <LinearGradient
                      colors={['#77C4C6', '#4B84C4']}
                      style={styles.unselectedBorder}
                    >
                      <View style={styles.unselectedContent}>
                        {/* Inside view has white background */}
                        <Text style={styles.unselectedGenderIcon}>♂</Text>
                        <Text style={styles.unselectedGenderText}>Male</Text>
                      </View>
                    </LinearGradient>
                  </View>
                )}
              </TouchableOpacity>

              {/* Female Button */}
              <TouchableOpacity
                onPress={async () => {
                  setTrainerGender('FEMALE');
                  await setFieldValue('trainerGender', 'FEMALE');
                }}
                disabled={genderMatters} // Disable selection when genderMatters is true (user doesn't care)
              >
                {trainerGender === 'FEMALE' ? (
                  <LinearGradient
                    colors={['#C44B9B', '#4B84C4']}
                    style={styles.genderButtonSelected}
                  >
                    <Text style={styles.selectedGenderIcon}>♀</Text>
                    <Text style={styles.selectedGenderText}>Female</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.genderButtonUnselected}>
                    {/* Apply gradient to border */}
                    <LinearGradient
                      colors={['#77C4C6', '#4B84C4']}
                      style={styles.unselectedBorder}
                    >
                      <View style={styles.unselectedContent}>
                        {/* Inside view has white background */}
                        <Text style={styles.unselectedGenderIcon}>♀</Text>
                        <Text style={styles.unselectedGenderText}>Female</Text>
                      </View>
                    </LinearGradient>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {touched.trainerGender && errors.trainerGender && (
              <Text style={styles.errorText}>{errors.trainerGender}</Text>
            )}

            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceText}>It doesn’t matter</Text>
              <Switch
                value={genderMatters}
                onValueChange={async (val) => {
                  setGenderMatters(val);
                  await setFieldValue('genderMatters', val); // update formik field
                  if (val) {
                    await setFieldValue('trainerGender', ''); // Clear gender when it doesn't matter
                    setTrainerGender(null); // Reset state when gender doesn't matter
                  }
                }}
                style={styles.switch}
                trackColor={{ false: '#767577', true: '#4B84C4' }}
              />
            </View>


            {/* Continue Button */}
            <Pressable style={styles.continueButton} onPress={ () =>handleSubmit()}>
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
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontFamily: 'Josefin Sans',
    fontSize: 40,
    fontWeight: '500',
    lineHeight: 50,
    letterSpacing: -0.32,
    color: '#000000',
    marginTop: 40,
    textAlign: 'left',
  },
  subTitle: {
    fontFamily: 'Josefin Sans',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: -0.32,
    color: '#9B9B9B',
    textAlign: 'left',
    marginVertical: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'Josefin Sans',
    lineHeight: 21,
    letterSpacing: -0.32,
    color: '#000000',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: '#F4F6F9',
    borderRadius: 20,
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    color: '#9B9B9B',
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 0,
  },
  preferenceText: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'Josefin Sans',
    color: '#000000',
    textAlign: 'left',
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  genderPreference: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  genderButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: 'transparent',
    marginHorizontal: 20,
  },
  selectedGenderIcon: {
    fontSize: 70, // Larger icon for selected gender
    color: '#FFFFFF', // White icon for selected gender
  },
  selectedGenderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF', // Text color for selected state
    textAlign: 'center',
  },
  genderButtonSelected: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  unselectedContent: {
    width: 146, // A bit smaller than the border so it fits inside
    height: 146,
    borderRadius: 75,
    backgroundColor: '#FFFFFF', // White background for unselected state
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedBorder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    padding: 2, // To show a bit of the gradient border
  },
  unselectedGenderIcon: {
    fontSize: 70, // Larger icon for unselected gender
    color: '#77C4C6', // Gradient color for unselected state
  },
  unselectedGenderText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#77C4C6', // Gradient text color for unselected state
    textAlign: 'center',
  },
  genderButtonUnselected: {
    backgroundColor: '#FFFFFF', // Keep the background white
    borderRadius: 50,
    padding: 3, // Adjust for the border gradient effect
  },
  continueButton: {
    backgroundColor: '#4B84C4',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 50,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});
