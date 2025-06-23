import React, { useEffect } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";

import { Slot, Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/context/AuthContext";
import { StripeProvider } from '@stripe/stripe-react-native';
import { NutritionProvider } from "@/context/NutritionContext"; // ✅ import
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    "Josefin-Sans-Regular": require("@/assets/fonts/Josefin_Sans/JosefinSans-Regular.ttf"),
    "Josefin-Sans-Bold": require("@/assets/fonts/Josefin_Sans/JosefinSans-Bold.ttf"),
  });

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (fontsLoaded) {
        setTimeout(async () => {
          await SplashScreen.hideAsync();
        }, 2000);
      }
    };

    hideSplashScreen();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
  <StripeProvider
    publishableKey="pk_test_51OE1AeH60LqN16uh3DXLAUh0F2Q572I3Ff9GOaSLZ8Sc0ocPDHg2jf6t3Ivpivvd8dEqgc9gJjU0BiHyTt6u5GdE00Lz7ZGKeq"
    merchantIdentifier="merchant.com.vtcapp"
  >
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NutritionProvider>
          <SafeAreaView style={[styles.safeArea, { backgroundColor: colorScheme === "dark" ? "#000000" : "#FFFFFF" }]}>
            <Stack screenOptions={{
              headerShown: false,
            }}>
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="welcome" options={{ headerShown: false }} />
              <Stack.Screen name="trainerHome" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </SafeAreaView>
        </NutritionProvider>
      </AuthProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  </StripeProvider>
);

}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
