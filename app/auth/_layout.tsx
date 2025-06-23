import React, {useEffect} from 'react';
import { Stack } from 'expo-router';
import {useAuth} from "@/context/AuthContext";


export default function AuthLayout() {
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
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="complete-profile" />
      <Stack.Screen name="starting-page" />
    </Stack>
  );
}
