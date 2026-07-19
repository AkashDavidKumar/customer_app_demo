import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuthLayout } from '../../components/layouts/AuthLayout';
import { InputField } from '../../components/common/InputField';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { OTPInput } from '../../components/common/OTPInput';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { useResetPasswordMutation, useForgotPasswordMutation } from '../../api/hooks/useAuth';
import { resetPasswordSchema, ResetPasswordFormData } from '../../utils/validators';
import { extractErrorMessage } from '../../utils/errorHandler';
import { useToastStore } from '../../store/toast-store';
import { AuthStackParamList } from '../../navigation/types';
import { theme } from '../../theme';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'ResetPassword'>;
type RouteType = RouteProp<AuthStackParamList, 'ResetPassword'>;

export const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const phoneNumber = route.params?.phoneNumber || '';

  const showToast = useToastStore((state) => state.showToast);
  const { mutate: resetPassword, isPending: isResetting } = useResetPasswordMutation();
  const { mutate: requestResetOtp, isPending: isRequesting } = useForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: '',
      newPassword: '',
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword(
      { ...data, phoneNumber },
      {
        onSuccess: () => {
          showToast('Password reset successfully! You can now log in.', 'success');
          // Navigate back to Login and clear stack so they don't go back to reset
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
        onError: (error) => {
          showToast(extractErrorMessage(error, 'Failed to reset password'), 'error');
        },
      }
    );
  };

  const handleResendOtp = () => {
    requestResetOtp(
      { phoneNumber },
      {
        onSuccess: () => showToast('OTP resent', 'success'),
        onError: (error) => showToast(extractErrorMessage(error, 'Failed to resend'), 'error'),
      }
    );
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle={`Enter the 4-digit code sent to ${phoneNumber} and your new password.`}
    >
      <LoadingOverlay visible={isResetting || isRequesting} message="Processing..." />

      <View style={styles.form}>
        <Controller
          control={control}
          name="otp"
          render={({ field: { onChange, value } }) => (
            <OTPInput
              length={4}
              value={value}
              onChange={onChange}
              error={!!errors.otp}
            />
          )}
        />
        {errors.otp && <Text style={styles.errorText}>{errors.otp.message}</Text>}

        <View style={styles.resendContainer}>
          <CountdownTimer initialSeconds={60} onResend={handleResendOtp} isResending={isRequesting} />
        </View>

        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="New Password"
              placeholder="Create a new password (min 6 char)"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.newPassword?.message}
            />
          )}
        />

        <PrimaryButton
          title="Reset Password"
          onPress={handleSubmit(onSubmit)}
          loading={isResetting}
          style={styles.button}
        />
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  form: {
    marginTop: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: theme.typography.sizes.sm,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  button: {
    marginBottom: theme.spacing.xl,
  },
});
