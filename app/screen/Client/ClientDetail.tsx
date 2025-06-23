import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function ClientDetail() {
  const { name, subtitle, imageUri } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri as string }} style={styles.clientImage} />
      <Text style={styles.clientName}>{name}</Text>
      <Text style={styles.clientSubtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  clientImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  clientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'Josefin Sans',
  },
  clientSubtitle: {
    fontSize: 16,
    color: '#777',
    fontFamily: 'Josefin Sans',
  },
});
