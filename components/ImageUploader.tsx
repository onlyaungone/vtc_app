import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useImageUpload } from '@/hooks/shared/useImageUpload';
import { useImagePicker } from '@/hooks/shared/useImagePicker';

interface ImageUploaderProps {
  route: 'profile' | 'testimonials';
  onUploadComplete: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ route, onUploadComplete }) => {
  const { image, pickImage, clearImage } = useImagePicker();
  const { uploadImage, uploading, uploadError, uploadResult, progress } = useImageUpload();

  const handleImageSelected = async () => {
    await pickImage();
  };

  // As soon as image is picked, upload it
  useEffect(() => {
    if (image) {
      uploadImage(route, image);
    }
  }, [image]);

  useEffect(() => {
    if (uploadResult) {
      onUploadComplete(uploadResult.url);
      clearImage();
    }
  }, [uploadResult]);

  useEffect(() => {
    if (uploadError) {
      Alert.alert('Upload Error', uploadError);
    }
  }, [uploadError]);

  return (
    <Pressable style={styles.photoAdd} onPress={handleImageSelected}>
      {uploading ?
        (
          <View>
            <ActivityIndicator size="small" color="#0000ff" />
            <Text>Uploading: {progress}%</Text>
          </View>
        ) : (
          <Text style={styles.photoAddText}>+</Text>
        )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  photoAdd: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#F4F6F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoAddText: {
    fontSize: 30,
    color: '#A9A9A9',
  }
});

export default ImageUploader;
