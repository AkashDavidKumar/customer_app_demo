import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/auth-store';
import {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
} from './types';

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
      <AuthStack.Screen name="Login" component={DummyScreen('Login')} />
      <AuthStack.Screen name="Register" component={DummyScreen('Register')} />
      <AuthStack.Screen name="ForgotPassword" component={DummyScreen('ForgotPassword')} />
      <AuthStack.Screen name="ResetPassword" component={DummyScreen('ResetPassword')} />
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
