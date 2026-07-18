import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../theme';

type StatusType =
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'unverified'
  | 'pending'
  | 'approved'
  | 'rejected';

interface StatusBadgeProps {
  status: StatusType;
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, style }) => {
  const normalizedStatus = status.toLowerCase();

  let badgeColor = theme.colors.border.light;
  let textColor = theme.colors.text.secondaryLight;
  let statusText = status.replace('_', ' ');

  switch (normalizedStatus) {
    case 'confirmed':
    case 'active':
    case 'completed':
    case 'approved':
      badgeColor = theme.colors.status.successBg;
      textColor = theme.colors.status.success;
      break;
    case 'payment_pending':
    case 'pending':
      badgeColor = theme.colors.status.warningBg;
      textColor = theme.colors.status.warning;
      break;
    case 'cancelled':
    case 'rejected':
      badgeColor = theme.colors.status.errorBg;
      textColor = theme.colors.status.error;
      break;
    case 'unverified':
      badgeColor = theme.colors.border.light;
      textColor = theme.colors.text.mutedLight;
      break;
  }

  return (
    <View style={[styles.badge, { backgroundColor: badgeColor }, style]}>
      <Text style={[styles.text, { color: textColor }]}>
        {statusText.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.xs,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 0.5,
  },
});
