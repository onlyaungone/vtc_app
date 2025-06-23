import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

import * as ImagePicker from 'expo-image-picker';

interface ImagePickerResult {
  uri: string;
  type: string;
  name: string;
}

export const useImagePicker = () => {
  const [image, setImage] = useState<ImagePickerResult | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Cannot access media library.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // This will guarantee to exist
        const uri = result.assets[0].uri.split('/');

        const fileName = uri[uri.length - 1];
        const fileType = fileName.split('.').pop();

        setImage({
          uri: result.assets[0].uri,
          type: `image/${fileType}`,
          name: fileName,
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'An error occurred while selecting the image.');
    }
  };

  const clearImage = () => {
    setImage(null);
  };

  return { image, pickImage, clearImage };
};
