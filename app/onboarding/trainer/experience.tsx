import React, { useState, useMemo } from 'react';
import {
  View, Text, Pressable, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback, ScrollView
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Stack, useRouter } from 'expo-router';
import { Formik } from 'formik';

import { TrainerExperienceSchema } from '@/schemas/onboarding/trainer';
import { useTrainerOnboardingStore } from '@/hooks/onboarding/useTrainerOnboarding';

type DropdownOption = { label: string; value: string };

const Experience = () => {
  const router = useRouter();
  const { saveSchema } = useTrainerOnboardingStore();

  const mandatoryCertifications: DropdownOption[] = useMemo(() => [
    { label: 'Certificate IV in Fitness', value: 'Certificate IV in Fitness' },
    { label: 'Diploma of Fitness', value: 'Diploma of Fitness' },
    { label: 'Bachelor of Exercise and Sport Science', value: 'Bachelor of Exercise and Sport Science' },
    { label: 'Bachelor of Health and Physical Education', value: 'Bachelor of Health and Physical Education' },
    { label: 'Bachelor of Applied Fitness', value: 'Bachelor of Applied Fitness' },
    { label: 'Bachelor of Sport and Exercise Science (Strength and Conditioning)', value: 'Bachelor of Sport and Exercise Science (Strength and Conditioning)' },
    { label: 'Bachelor of Exercise Physiology', value: 'Bachelor of Exercise Physiology' },
    { label: 'Graduate Diploma of Exercise Science', value: 'Graduate Diploma of Exercise Science' },
    { label: 'Master of Clinical Exercise Physiology', value: 'Master of Clinical Exercise Physiology' },
    { label: 'Master of Sports Coaching', value: 'Master of Sports Coaching' },
    { label: 'PhD in Exercise Science/Sport Science', value: 'PhD in Exercise Science/Sport Science' },
    { label: 'Other', value: 'Other' }
  ], []);

  const additionalCertifications: DropdownOption[] = useMemo(() => [
    { label: 'ASCA Level 1 Certification', value: 'ASCA Level 1 Certification' },
    { label: 'ASCA Level 2 Certification', value: 'ASCA Level 2 Certification' },
    { label: 'ASCA Level 3 Certification', value: 'ASCA Level 3 Certification' },
    { label: 'Level 1 Sports Nutrition Certification', value: 'Level 1 Sports Nutrition Certification' },
    { label: 'Level 2 Sports Nutrition Certification', value: 'Level 2 Sports Nutrition Certification' },
    { label: 'Nutrition for Personal Trainers Certification', value: 'Nutrition for Personal Trainers Certification' },
    { label: 'Yoga Teacher Training (200 Hours)', value: 'Yoga Teacher Training (200 Hours)' },
    { label: 'Yoga Teacher Training (500 Hours)', value: 'Yoga Teacher Training (500 Hours)' },
    { label: 'Pilates Instructor Certification', value: 'Pilates Instructor Certification' },
    { label: 'Group Fitness Instructor Certification', value: 'Group Fitness Instructor Certification' },
    { label: 'Les Mills Instructor Certifications', value: 'Les Mills Instructor Certifications' },
    { label: 'Aqua Aerobics Instructor Certification', value: 'Aqua Aerobics Instructor Certification' },
    { label: 'Boxing for Fitness Certification', value: 'Boxing for Fitness Certification' },
    { label: 'CrossFit Level 1 Certification', value: 'CrossFit Level 1 Certification' },
    { label: 'TRX Suspension Training Certification', value: 'TRX Suspension Training Certification' },
    { label: 'Kettlebell Instructor Certification', value: 'Kettlebell Instructor Certification' },
    { label: 'Older Adults Fitness Certification', value: 'Older Adults Fitness Certification' },
    { label: 'Pre/Postnatal Exercise Certification', value: 'Pre/Postnatal Exercise Certification' },
    { label: 'Children’s Fitness Certification', value: 'Children’s Fitness Certification' },
  ], []);

  const [openMandatory, setOpenMandatory] = useState(false);
  const [openAdditional, setOpenAdditional] = useState(false);

  const handleContinue = async (values: {
    experienceLevel: string;
    mandatoryCertifications: string[];
    additionalCertifications: string[];
    customCertification: string;
    bio: string;
  }) => {
    await saveSchema('experience', values);
    router.push('/onboarding/trainer/personality');
  };

  return (
    <Formik
      initialValues={{
        experienceLevel: '',
        mandatoryCertifications: [] as string[],
        additionalCertifications: [] as string[],
        customCertification: '',
        bio: '',
      }}
      validationSchema={TrainerExperienceSchema}
      onSubmit={handleContinue}
    >
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, values, errors, touched }) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.container}>
            <Stack.Screen options={{ headerShown: false, headerTitle: '', headerTransparent: true, headerTintColor: '#D9D9D9' }} />

            <Text style={styles.headline}>Your experience</Text>
            <Text style={styles.subheadline}>Your industry experience</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Industry experience (years)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter industry experience"
                placeholderTextColor="#D9D9D9"
                onChangeText={handleChange('experienceLevel')}
                onBlur={handleBlur('experienceLevel')}
                value={values.experienceLevel}
              />
              {errors.experienceLevel && touched.experienceLevel && (
                <Text style={styles.errorText}>{errors.experienceLevel}</Text>
              )}
            </View>

            <View style={[styles.inputWrapper, openMandatory ? { zIndex: 2000 } : { zIndex: 1 }]}>
              <Text style={styles.label}>Mandatory Certifications</Text>
              <DropDownPicker<string>
                multiple
                open={openMandatory}
                value={values.mandatoryCertifications}
                items={mandatoryCertifications}
                setOpen={setOpenMandatory}
                setValue={(callback) => {
                  setFieldTouched('mandatoryCertifications', true);
                  setFieldValue('mandatoryCertifications', callback(values.mandatoryCertifications));
                }}
                style={styles.dropdown}
                placeholder="Select certifications"
              />
              {errors.mandatoryCertifications && touched.mandatoryCertifications && (
                <Text style={styles.errorText}>{errors.mandatoryCertifications}</Text>
              )}
              {values.mandatoryCertifications.length > 0 && (
                <View style={styles.selectedItemsContainer}>
                  {values.mandatoryCertifications.map((item) => (
                    <View key={item} style={styles.selectedItem}>
                      <Text style={styles.selectedItemText}>{item}</Text>
                      <Pressable onPress={() => setFieldValue('mandatoryCertifications', values.mandatoryCertifications.filter(i => i !== item))}>
                        <Text style={styles.removeItem}>×</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {values.mandatoryCertifications.includes('Other') && (
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Custom Certification</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your custom certification"
                  placeholderTextColor="#D9D9D9"
                  onChangeText={handleChange('customCertification')}
                  value={values.customCertification}
                />
              </View>
            )}

            <View style={[styles.inputWrapper, openAdditional ? { zIndex: 1000 } : { zIndex: 0 }]}>
              <Text style={styles.label}>Additional Certifications (optional)</Text>
              <DropDownPicker<string>
                multiple
                open={openAdditional}
                value={values.additionalCertifications}
                items={additionalCertifications}
                setOpen={setOpenAdditional}
                setValue={(callback) => {
                  setFieldTouched('additionalCertifications', true);
                  setFieldValue('additionalCertifications', callback(values.additionalCertifications));
                }}
                style={styles.dropdown}
                placeholder="Select additional certifications"
              />
              {values.additionalCertifications.length > 0 && (
                <View style={styles.selectedItemsContainer}>
                  {values.additionalCertifications.map((item) => (
                    <View key={item} style={styles.selectedItem}>
                      <Text style={styles.selectedItemText}>{item}</Text>
                      <Pressable onPress={() => setFieldValue('additionalCertifications', values.additionalCertifications.filter(i => i !== item))}>
                        <Text style={styles.removeItem}>×</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Tell us about yourself</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write a short professional bio here"
                placeholderTextColor="#D9D9D9"
                multiline
                onChangeText={handleChange('bio')}
                onBlur={handleBlur('bio')}
                value={values.bio}
              />
              {errors.bio && touched.bio && (
                <Text style={styles.errorText}>{errors.bio}</Text>
              )}
            </View>

            <Pressable style={styles.continueButton} onPress={() => handleSubmit()}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>
          </ScrollView>
        </TouchableWithoutFeedback>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#FFF' },
  headline: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subheadline: { fontSize: 14, color: '#A9A9A9', marginBottom: 20 },
  inputWrapper: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 5 },
  input: {
    backgroundColor: '#F4F6F9',
    borderRadius: 7,
    padding: 15,
    borderColor: '#D9D9D9',
    borderWidth: 1,
  },
  dropdown: {
    backgroundColor: '#F4F6F9',
    borderColor: '#D9D9D9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedItemText: {
    color: '#1E3A8A',
    fontSize: 14,
    marginRight: 6,
  },
  removeItem: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#4B84C4',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 50,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default Experience;
