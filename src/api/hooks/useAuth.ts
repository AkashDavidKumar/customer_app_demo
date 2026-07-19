import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth';
import { useAuthStore } from '../../store/auth-store';
import {
  LoginFormData,
  RegisterDetailsFormData,
  OtpFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from '../../utils/validators';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

export const useLoginMutation = () => {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (data) => {
      // Store token and user data in Zustand which persists via SecureStore
      setSession(data.token, data.user as any); // Type cast due to minor diffs in strict model vs api response, but conceptually identical
    },
  });
};

export const useRequestOtpMutation = () => {
  return useMutation({
    mutationFn: (phoneNumber: string) => authService.requestOtp(phoneNumber),
  });
};

export const useRegisterMutation = () => {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    // Combines register details and OTP
    mutationFn: (data: RegisterDetailsFormData & OtpFormData) => authService.register(data),
    onSuccess: (data) => {
      setSession(data.token, data.user);
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordFormData) => authService.forgotPasswordOtp(data.phoneNumber),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    // Combines phone number and reset password data
    mutationFn: (data: ResetPasswordFormData & { phoneNumber: string }) =>
      authService.resetPassword(data),
  });
};

export const useProfileQuery = (enabled: boolean = true) => {
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      try {
        const response = await authService.getProfile();
        // Sync Zustand store with latest profile data from server
        updateUser(response.user);
        return response;
      } catch (error: any) {
        // If profile fetch fails (e.g. 401), logout the user
        if (error?.response?.status === 401) {
          await logout();
        }
        throw error;
      }
    },
    enabled, // Only run if enabled (e.g. if we know a token exists)
    retry: false, // Don't retry auth checks if they fail, we want to log them out immediately
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
