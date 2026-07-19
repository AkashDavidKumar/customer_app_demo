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
import { useLoginMutation } from '../../api/hooks/useAuth';
import { loginSchema, LoginFormData } from '../../utils/validators';
import { extractErrorMessage } from '../../utils/errorHandler';
import { useToastStore } from '../../store/toast-store';
import { AuthStackParamList } from '../../navigation/types';
import { theme } from '../../theme';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const showToast = useToastStore((state) => state.showToast);
  const { mutate: login, isPending } = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onError: (error) => {
        showToast(extractErrorMessage(error, 'Login failed'), 'error');
      },
      onSuccess: () => {
        showToast('Successfully logged in', 'success');
        // RootNavigator will automatically redirect based on Zustand auth state
      },
    });
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue."
      logo
    >
      <LoadingOverlay visible={isPending} message="Signing you in..." />

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

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
            />
          )}
        />

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <PrimaryButton
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
          style={styles.loginButton}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupText}>Sign Up</Text>
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.xl,
  },
  forgotPasswordText: {
    color: theme.colors.primary.brand,
    fontWeight: theme.typography.weights.semiBold,
    fontSize: theme.typography.sizes.sm,
  },
  loginButton: {
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
  signupText: {
    color: theme.colors.primary.brand,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.sm,
  },
});
