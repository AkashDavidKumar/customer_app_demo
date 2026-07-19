import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuthLayout } from '../../components/layouts/AuthLayout';
import { InputField } from '../../components/common/InputField';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { useForgotPasswordMutation } from '../../api/hooks/useAuth';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../utils/validators';
import { extractErrorMessage } from '../../utils/errorHandler';
import { useToastStore } from '../../store/toast-store';
import { AuthStackParamList } from '../../navigation/types';
import { theme } from '../../theme';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const showToast = useToastStore((state) => state.showToast);
  const { mutate: requestResetOtp, isPending } = useForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    requestResetOtp(data, {
      onSuccess: () => {
        showToast('OTP sent to your phone', 'success');
        navigation.navigate('ResetPassword', { phoneNumber: data.phoneNumber });
      },
      onError: (error) => {
        showToast(extractErrorMessage(error, 'Failed to request reset OTP'), 'error');
      },
    });
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your phone number to receive a reset code."
    >
      <LoadingOverlay visible={isPending} message="Sending code..." />

      <View style={styles.form}>
        <Controller
          control={control}
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
              error={errors.phoneNumber?.message}
            />
          )}
        />

        <PrimaryButton
          title="Send Reset Code"
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
          style={styles.button}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Remembered your password? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  form: {
    marginTop: theme.spacing.lg,
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
