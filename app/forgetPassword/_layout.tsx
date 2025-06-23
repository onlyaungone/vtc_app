import React from 'react';
import { Stack } from 'expo-router';

export default function ForgetPasswordLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerBackVisible: false,
        headerTransparent: true,
        headerTintColor: '#D9D9D9',
      }}
    >
    </Stack>
  );
}
