import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';

import { Stack, useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Formik } from 'formik';

import { uploadData } from 'aws-amplify/storage';

import { useTrainerOnboardingStore } from '@/hooks/onboarding/useTrainerOnboarding';
import { TrainerQualificationsSchema } from '@/schemas/onboarding/trainer';
import { useAuth } from '@/context/AuthContext';

export default function Qualifications() {
  const router = useRouter();
  const { saveSchema } = useTrainerOnboardingStore();
  const { user } = useAuth();

  const [qualifications, setQualifications] = useState<{ name: string; path: string }[]>([]);
  const [uploadingQualifications, setUploadingQualifications] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadComplete, setIsUploadComplete] = useState(false);

  const handleContinue = async (values: any) => {
    if (!isUploadComplete) {
      Alert.alert('Upload Incomplete', 'Please upload your qualifications before continuing.');
      return;
    }

    const finalValues = {
      ...values,
      qualifications: qualifications.map((q) => q.path),
    };

    try {
      await saveSchema('qualifications', finalValues);
      router.replace('/onboarding/trainer/payment');
    } catch (error) {
      console.error('Error submitting schema:', error);
      Alert.alert('Submission Error', 'Failed to submit trainer application. Please try again.');
      router.replace('/');
    }
  };

  const handleQualificationsUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/jpeg', 'image/png'],
    });

    if (result.assets && result.assets.length > 0) {
      setUploadingQualifications(true);
      setUploadError(null);

      try {
        if (!user) {
          throw new Error('User not found.');
        }

        const asset = result.assets[0];
        const uri = asset.uri;
        const name = asset.name || uri.split('/').pop() || `file-${Date.now()}`;
        const contentType = asset.mimeType || 'application/octet-stream';

        const response = await fetch(uri);
        const blob = await response.blob();
        const fileName = `${Date.now()}-${name}`;
        const s3Key = `public/${user}/qualifications/${fileName}`;

        const operation = await uploadData({
          path: s3Key,
          data: blob,
          options: {
            contentType,
          },
        });

        const uploadResult = await operation.result;
        setQualifications((prev) => [...prev, { name, path: uploadResult.path }]);
        setIsUploadComplete(true);
      } catch (error) {
        console.error('Error uploading qualification document:', error);
        setUploadError('Failed to upload document. Please try again.');
        Alert.alert('Upload Error', 'Failed to upload document. Please try again.');
      } finally {
        setUploadingQualifications(false);
      }
    }
  };

  return (
    <Formik
      initialValues={{
        qualifications: [],
        insurance: '',
      }}
      validationSchema={TrainerQualificationsSchema}
      onSubmit={handleContinue}
    >
      {({ handleSubmit, errors, touched }) => (
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

          <Text style={styles.headline}>Qualifications</Text>
          <Text style={styles.subheadline}>Upload your certifications</Text>

          <Text style={styles.label}>Upload certification</Text>
          <Pressable
            style={styles.uploadButton}
            onPress={handleQualificationsUpload}
            disabled={uploadingQualifications}
          >
            {uploadingQualifications ? (
              <View style={styles.uploading}>
                <ActivityIndicator size="small" color="#0000ff" />
                <Text>Uploading...</Text>
              </View>
            ) : (
              <Text style={styles.uploadText}>Upload your fitness qualification +</Text>
            )}
          </Pressable>

          {qualifications.length > 0 && (
            <View style={styles.uploadedFiles}>
              {qualifications.map((file, index) => (
                <View key={index} style={styles.uploadItem}>
                  <Text style={styles.uploadedFileText}>
                    {file.name}
                  </Text>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() =>
                      setQualifications((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {errors.qualifications && touched.qualifications && (
            <Text style={styles.errorText}>{errors.qualifications}</Text>
          )}

          {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}

          <Pressable
            style={[
              styles.continueButton,
              { backgroundColor: isUploadComplete ? '#4B84C4' : '#A9A9A9' },
            ]}
            onPress={() => handleSubmit()}
            disabled={!isUploadComplete}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </Pressable>
        </View>
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
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 5,
  },
  uploadButton: {
    backgroundColor: '#F4F6F9',
    borderRadius: 7,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 16,
    color: '#A9A9A9',
  },
  uploading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  continueButton: {
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
  uploadedFiles: {
    marginTop: 10,
  },
  uploadedFileText: {
    fontSize: 14,
    color: '#4B84C4',
  },
  uploadItem: {
  marginBottom: 15,
  borderWidth: 1,
  borderColor: '#D9D9D9',
  borderRadius: 10,
  padding: 10,
  backgroundColor: '#F4F6F9',
},

previewImage: {
  width: 100,
  height: 100,
  borderRadius: 5,
  marginBottom: 5,
},

pdfPreview: {
  width: 100,
  height: 100,
  borderRadius: 5,
  marginBottom: 5,
  backgroundColor: '#E0E0E0',
  justifyContent: 'center',
  alignItems: 'center',
},

pdfText: {
  color: '#4B4B4B',
  fontSize: 14,
},

removeButton: {
  marginTop: 5,
  backgroundColor: '#DC2626',
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 5,
  alignSelf: 'flex-start',
},

removeButtonText: {
  color: 'white',
  fontSize: 12,
},

});
