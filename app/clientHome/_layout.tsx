import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function AppLayout() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerTitle: '',
          headerTransparent: true,
          headerTintColor: '#D9D9D9',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push('/clientHome/home')}>
              <Text style={styles.backButtonText}>{'< Home'}</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  backButtonText: {
    color: '#4B84C4',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
      textDecorationLine: 'underline'
  },
});
