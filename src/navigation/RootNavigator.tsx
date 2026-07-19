import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/auth-store';
import {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
} from './types';

// Auth Screens
import { SplashScreen } from '../screens/auth/SplashScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';

// Dummy Screen Components for compile and flow check
const DummyScreen = (name: string) => () => (
  <View style={styles.dummyContainer}>
    <Text style={styles.dummyText}>{name} Screen</Text>
  </View>
);

const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </AuthStack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Explore" component={DummyScreen('Explore')} />
      <Tab.Screen name="MyBookings" component={DummyScreen('MyBookings')} />
      <Tab.Screen name="Support" component={DummyScreen('Support')} />
      <Tab.Screen name="Profile" component={DummyScreen('Profile')} />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Artificial delay to ensure splash shows and rehydration occurs
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="VehicleDetails" component={DummyScreen('Vehicle Details')} />
          <Stack.Screen
            name="CheckoutModal"
            component={DummyScreen('Checkout Modal')}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen name="LicenseUpload" component={DummyScreen('License Upload')} />
          <Stack.Screen name="WriteReview" component={DummyScreen('Write Review')} />
          <Stack.Screen name="TermsAndPolicies" component={DummyScreen('Terms & Policies')} />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  dummyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  dummyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
});
