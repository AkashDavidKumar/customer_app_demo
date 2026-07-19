import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, TouchableOpacity, AppState, AppStateStatus } from 'react-native';
import { theme } from '../../theme';

interface CountdownTimerProps {
  initialSeconds: number;
  onResend: () => void;
  isResending?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  onResend,
  isResending,
}) => {
  const [remaining, setRemaining] = useState(initialSeconds);
  const targetTimeRef = useRef<number>(Date.now() + initialSeconds * 1000);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Reset target time whenever initialSeconds changes (e.g. after a resend)
    targetTimeRef.current = Date.now() + initialSeconds * 1000;
    setRemaining(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.round((targetTimeRef.current - now) / 1000);
      if (diff > 0) {
        setRemaining(diff);
      } else {
        setRemaining(0);
      }
    };

    const interval = setInterval(updateTimer, 1000);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground, recalculate time instantly
        updateTimer();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  const handleResend = () => {
    onResend();
    // Re-trigger timer from parent usually updates initialSeconds, but we can optimistically reset here too
    targetTimeRef.current = Date.now() + initialSeconds * 1000;
    setRemaining(initialSeconds);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (remaining > 0) {
    return (
      <Text style={styles.text}>
        Resend OTP in <Text style={styles.timer}>{formatTime(remaining)}</Text>
      </Text>
    );
  }

  return (
    <TouchableOpacity onPress={handleResend} disabled={isResending} activeOpacity={0.7}>
      <Text style={[styles.text, styles.resendActive]}>
        {isResending ? 'Resending...' : 'Resend OTP'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondaryLight,
    textAlign: 'center',
  },
  timer: {
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primaryLight,
  },
  resendActive: {
    color: theme.colors.primary.brand,
    fontWeight: theme.typography.weights.semiBold,
  },
});
