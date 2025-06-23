import React from 'react';
import { Tabs } from 'expo-router';
import { Image, StyleSheet } from 'react-native';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === 'home-screen') {
            iconSource = focused
              ? require('@/assets/images/home_selected.png')
              : require('@/assets/images/home_unselected.png');
          } else if (route.name === 'training&nutrition-screen') {
            iconSource = focused
              ? require('@/assets/images/training_selected.png')
              : require('@/assets/images/training_unselected.png');
          } else if (route.name === 'social-screen') {
            iconSource = focused
              ? require('@/assets/images/socials_selected.png')
              : require('@/assets/images/socials_unselected.png');
          } else if (route.name === 'profile-screen') {
            iconSource = focused
              ? require('@/assets/images/profile.png')
              : require('@/assets/images/profile.png');
          }

          return (
            <Image
              source={iconSource}
              style={styles.tabIcon}
              resizeMode="contain"
            />
          );
        },
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tabs.Screen name="home-screen" options={{ title: 'Home', headerShown: false }} />
      <Tabs.Screen name="training&nutrition-screen" options={{ title: 'Training', headerShown: false }} />
      <Tabs.Screen name="social-screen" options={{ title: 'Social', headerShown: false }} />
      <Tabs.Screen name="profile-screen" options={{ title: 'Profile', headerShown: false }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 25,
    height: 25,
    marginBottom: -5,
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
    height: 50,
    paddingBottom: 5,
    paddingTop: 5,
  },
});
