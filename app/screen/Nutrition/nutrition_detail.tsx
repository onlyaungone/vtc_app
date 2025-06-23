import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';

export default function NutritionDetail() {
  const router = useRouter();
  const { id, title, subtitle, description, image } = useLocalSearchParams();

  const getImageSource = (): any => {
    if (!image) return null;

    // Handle remote/picked images
    if (typeof image === 'string' && (image.startsWith('http') || image.startsWith('file://'))) {
      return { uri: image };
    }

  };

  const handleEdit = () => {
    router.push({
      pathname: '/screen/Nutrition/nutrition_edit',
      params: { id, title, subtitle, description, image },
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Nutrition Details',
          headerBackVisible: false,
          headerTintColor: '#4B84C4',
        }}
      />

      <Text style={styles.label}>Image</Text>
      {getImageSource() ? (
        <Image source={getImageSource()} style={styles.image} resizeMode="cover" />
      ) : (
        <Text style={styles.text}>No image available</Text>
      )}

      <Text style={styles.label}>Title</Text>
      <Text style={styles.text}>{title}</Text>

      <Text style={styles.label}>Subtitle</Text>
      <Text style={styles.text}>{subtitle}</Text>

      <Text style={styles.label}>Description</Text>
      <Text style={styles.text}>{description}</Text>

      <TouchableOpacity style={styles.button} onPress={handleEdit}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#f5f5f5' },
  label: { fontWeight: 'bold', marginTop: 15, fontSize: 16 },
  text: { marginTop: 5, fontSize: 15, color: '#333' },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#FF9800',
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
