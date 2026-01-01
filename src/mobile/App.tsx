// PHOTO-REPORT Mobile App
// Main entry point with tab navigation

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CameraScreen from './src/screens/CameraScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import SyncScreen from './src/screens/SyncScreen';
import { initDatabase } from './src/services/database';

const Tab = createBottomTabNavigator();

// Theme colors matching web frontend
const COLORS = {
  navyDeep: '#0F1F35',
  navyPrimary: '#1B3A5C',
  goldAccent: '#D4A574',
  white: '#FFFFFF',
  steel: '#4A5568',
};

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function init() {
      try {
        await initDatabase();
        setIsReady(true);
      } catch (error) {
        console.error('Initialization error:', error);
        setIsReady(true); // Continue anyway
      }
    }
    init();
  }, []);

  const handlePhotoTaken = () => {
    // Trigger refresh on gallery and sync screens
    setRefreshTrigger(prev => prev + 1);
  };

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.goldAccent} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.navyDeep,
            borderTopColor: COLORS.navyPrimary,
            borderTopWidth: 1,
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
          },
          tabBarActiveTintColor: COLORS.goldAccent,
          tabBarInactiveTintColor: COLORS.steel,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'camera';

            if (route.name === 'Câmera') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'Galeria') {
              iconName = focused ? 'images' : 'images-outline';
            } else if (route.name === 'Sync') {
              iconName = focused ? 'cloud' : 'cloud-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Câmera">
          {() => <CameraScreen onPhotoTaken={handlePhotoTaken} />}
        </Tab.Screen>
        <Tab.Screen name="Galeria">
          {() => <GalleryScreen refreshTrigger={refreshTrigger} />}
        </Tab.Screen>
        <Tab.Screen name="Sync">
          {() => <SyncScreen refreshTrigger={refreshTrigger} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.navyDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
