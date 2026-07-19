import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { useToastStore } from '../../store/toast-store';
import { theme } from '../../theme';

export const Toast: React.FC = () => {
  const { message, type, isVisible } = useToastStore();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, translateY, opacity]);

  if (!message && !isVisible) return null;

  const backgroundColor =
    type === 'error'
      ? theme.colors.status.error
      : type === 'success'
      ? theme.colors.status.success
      : theme.colors.primary.brand;

  return (
    <SafeAreaView style={styles.safeArea} pointerEvents="none">
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 0 : 40,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.round,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
    minWidth: '70%',
    maxWidth: '90%',
  },
  message: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semiBold,
    textAlign: 'center',
  },
});
