import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    
    // Trigger tactile haptic click
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const buttonStyles = [
    styles.baseButton,
    styles[variant],
    (disabled || loading) && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.baseText,
    styles[`${variant}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={buttonStyles}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? theme.colors.primary.brand : '#FFFFFF'}
        />
      ) : (
        <>
          {icon && <React.Fragment>{icon}</React.Fragment>}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    height: 52,
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  baseText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    textAlign: 'center',
  },
  primary: {
    backgroundColor: theme.colors.primary.brand,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondary: {
    backgroundColor: theme.colors.accent.teal,
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary.brand,
    elevation: 0,
    shadowOpacity: 0,
  },
  outlineText: {
    color: theme.colors.primary.brand,
  },
  danger: {
    backgroundColor: theme.colors.status.error,
  },
  dangerText: {
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: theme.colors.border.light,
    borderColor: theme.colors.border.light,
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledText: {
    color: theme.colors.text.mutedLight,
  },
});
