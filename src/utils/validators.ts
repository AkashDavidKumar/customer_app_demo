import { z } from 'zod';

const phoneRegex = /^[0-9]{10}$/;

export const phoneSchema = z.string().regex(phoneRegex, 'Phone number must be exactly 10 digits');

export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export const loginSchema = z.object({
  phoneNumber: phoneSchema,
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerDetailsSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: phoneSchema,
  password: passwordSchema,
});

export type RegisterDetailsFormData = z.infer<typeof registerDetailsSchema>;

export const otpSchema = z.object({
  otp: z.string().length(4, 'OTP must be exactly 4 digits'),
});

export type OtpFormData = z.infer<typeof otpSchema>;

export const forgotPasswordSchema = z.object({
  phoneNumber: phoneSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  otp: z.string().length(4, 'OTP must be exactly 4 digits'),
  newPassword: passwordSchema,
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
