import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuthLayout } from '../../components/layouts/AuthLayout';
import { InputField } from '../../components/common/InputField';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { OTPInput } from '../../components/common/OTPInput';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { useRequestOtpMutation, useRegisterMutation } from '../../api/hooks/useAuth';
import {
  registerDetailsSchema,
  otpSchema,
  RegisterDetailsFormData,
  OtpFormData,
} from '../../utils/validators';
import { extractErrorMessage } from '../../utils/errorHandler';
import { useToastStore } from '../../store/toast-store';
import { AuthStackParamList } from '../../navigation/types';
import { theme } from '../../theme';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const showToast = useToastStore((state) => state.showToast);

  const [step, setStep] = useState<1 | 2>(1);
  const [cachedDetails, setCachedDetails] = useState<RegisterDetailsFormData | null>(null);

  const { mutate: requestOtp, isPending: isRequesting } = useRequestOtpMutation();
  const { mutate: register, isPending: isRegistering } = useRegisterMutation();

  const detailsForm = useForm<RegisterDetailsFormData>({
    resolver: zodResolver(registerDetailsSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      password: '',
    },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleRequestOtp = (data: RegisterDetailsFormData) => {
    requestOtp(data.phoneNumber, {
      onSuccess: () => {
        setCachedDetails(data);
        setStep(2);
        showToast('OTP sent to your phone', 'success');
      },
      onError: (error) => {
        showToast(extractErrorMessage(error, 'Failed to send OTP'), 'error');
      },
    });
  };

  const handleRegister = (otpData: OtpFormData) => {
    if (!cachedDetails) return;
    register(
      { ...cachedDetails, ...otpData },
      {
        onSuccess: () => {
          showToast('Account created successfully!', 'success');
          // RootNavigator redirects due to Zustand token change
        },
        onError: (error) => {
          showToast(extractErrorMessage(error, 'Registration failed'), 'error');
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (cachedDetails) {
      requestOtp(cachedDetails.phoneNumber, {
        onSuccess: () => showToast('OTP resent', 'success'),
        onError: (error) => showToast(extractErrorMessage(error, 'Failed to resend'), 'error'),
      });
    }
  };

  if (step === 2 && cachedDetails) {
    return (
      <AuthLayout
        title="Verify Number"
        subtitle={`Enter the 4-digit code sent to ${cachedDetails.phoneNumber}`}
      >
        <LoadingOverlay visible={isRegistering || isRequesting} message="Verifying..." />
        <View style={styles.form}>
          <Controller
            control={otpForm.control}
            name="otp"
            render={({ field: { onChange, value } }) => (
              <OTPInput
                length={4}
                value={value}
                onChange={onChange}
                error={!!otpForm.formState.errors.otp}
              />
            )}
          />
          {otpForm.formState.errors.otp && (
            <Text style={styles.errorText}>{otpForm.formState.errors.otp.message}</Text>
          )}

          <View style={styles.resendContainer}>
            <CountdownTimer initialSeconds={60} onResend={handleResendOtp} isResending={isRequesting} />
          </View>

          <PrimaryButton
            title="Verify & Create Account"
            onPress={otpForm.handleSubmit(handleRegister)}
            loading={isRegistering}
            style={styles.button}
          />
        </View>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create Account" subtitle="Join us and start renting vehicles.">
      <LoadingOverlay visible={isRequesting} message="Sending OTP..." />
      <View style={styles.form}>
        <Controller
          control={detailsForm.control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Full Name"
              placeholder="Enter your full name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={detailsForm.formState.errors.fullName?.message}
            />
          )}
        />
        <Controller
          control={detailsForm.control}
          name="phoneNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Phone Number"
              placeholder="Enter your 10-digit number"
              keyboardType="phone-pad"
              maxLength={10}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={detailsForm.formState.errors.phoneNumber?.message}
            />
          )}
        />
        <Controller
          control={detailsForm.control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Password"
              placeholder="Create a password (min 6 char)"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={detailsForm.formState.errors.password?.message}
            />
          )}
        />

        <PrimaryButton
          title="Continue"
          onPress={detailsForm.handleSubmit(handleRequestOtp)}
          loading={isRequesting}
          style={styles.button}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.text.secondaryLight,
    fontSize: theme.typography.sizes.sm,
  },
  linkText: {
    color: theme.colors.primary.brand,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.sm,
  },
});
