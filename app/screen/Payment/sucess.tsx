import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>🎉 Payment Successful!</Text>
      <Text style={styles.subtitle}>Thank you for purchasing the package.</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/clientHome/home')}>
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 15, color: '#4BB543' },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#555', marginBottom: 30 },
  button: { backgroundColor: '#3777F3', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
