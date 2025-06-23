import { Stack } from 'expo-router';
import { View, Animated, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useProgressOnboarding } from '@/hooks/onboarding/useProgressOnboarding';

export default function OnboardingLayout() {
  const [progressBarValue] = useState(new Animated.Value(0));



  const animateProgress = (toValue: number) => {
    Animated.timing(progressBarValue, {
      toValue,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  useProgressOnboarding(animateProgress);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{ headerShown: false }}
      />

      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressBarValue.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      <Stack />
    </View>
  );
}

const styles = StyleSheet.create({
    progressBarContainer: {
      position: 'absolute',
      top: 20,
      left: '50%',
      width: 320,
      transform: [{ translateX: -(320 / 2) }], 
      height: 8,
      zIndex: 10,
      borderRadius: 10,
      backgroundColor: '#D9D9D9',
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#00CFFF',
      borderRadius: 10, 
    },// Matches the progressBarContainer
});