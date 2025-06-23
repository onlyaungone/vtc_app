import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';

export default function NutritionEdit() {
  const router = useRouter();
  const {
    id,
    title: initTitle,
    subtitle: initSubtitle,
    description: initDesc,
    image: initImage,
  } = useLocalSearchParams();

  const [title, setTitle] = useState<string>(initTitle as string);
  const [subtitle, setSubtitle] = useState<string>(initSubtitle as string);
  const [description, setDescription] = useState<string>(initDesc as string);
  const [imageUri, setImageUri] = useState<string>(initImage as string);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access the photo library is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpdate = () => {
    console.log(`Updating nutrition ID ${id}`, {
      title,
      subtitle,
      description,
      image: { uri: imageUri },
      imageName: imageUri,
    });

    router.replace({
      pathname: '/screen/Nutrition/nutrition_screen',
      params: {
        updated: JSON.stringify({
          id,
          title,
          subtitle,
          description,
          image: { uri: imageUri },
          imageName: imageUri,
        }),
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Nutrition Edit',
            headerBackVisible: false,
            headerTintColor: '#4B84C4',
          }}
        />

        <Text style={styles.label}>Edit Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Edit Subtitle</Text>
        <TextInput style={styles.input} value={subtitle} onChangeText={setSubtitle} />

        <Text style={styles.label}>Edit Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Image</Text>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.noImageText}>No image selected</Text>
        )}
        <TouchableOpacity style={styles.pickButton} onPress={handlePickImage}>
          <Text style={styles.pickButtonText}>Pick Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#ffffff' },
  label: { fontWeight: 'bold', marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },
  textArea: { height: 100 },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
  noImageText: {
    color: '#999',
    marginTop: 10,
    fontStyle: 'italic',
  },
  pickButton: {
    backgroundColor: '#4B84C4',
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  pickButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FF9800',
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
