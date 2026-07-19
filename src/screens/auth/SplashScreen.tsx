import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useAuthStore } from '../../store/auth-store';
import { useProfileQuery } from '../../api/hooks/useAuth';
import { theme } from '../../theme';
import * as SecureStore from 'expo-secure-store';

export const SplashScreen: React.FC = () => {
  const { token, logout } = useAuthStore();
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // We only run the profile query if there's a token stored
  const { data, error, isLoading, isError } = useProfileQuery(!!token);

  useEffect(() => {
    // Basic pulse animation for splash
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: 20,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, opacity]);

  useEffect(() => {
    // If we have a token, we rely on useProfileQuery to determine session validity.
    // If it fails (e.g., 401), the query handles logout, and RootNavigator shifts us to Auth.
    // If it succeeds, RootNavigator shifts us to MainTabs.
    
    const checkOrphanToken = async () => {
      if (!token) {
        // Double check secure store just in case hydration was slow, but Zustand persist should handle it.
        const stored = await SecureStore.getItemAsync('auth-storage');
        if (!stored) {
          // Definitely no token, trigger logout just to ensure clean state
          logout();
        }
      }
    };
    
    checkOrphanToken();
  }, [token, logout, isError]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <Animated.Text style={styles.logoText}>C</Animated.Text>
        </View>
        <Animated.Text style={styles.brandText}>Car Rental</Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary.brand,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
    marginBottom: theme.spacing.lg,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  brandText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primaryLight,
  },
});
