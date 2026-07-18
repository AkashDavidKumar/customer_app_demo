import { axiosClient } from '../axios-client';
import { LoginResponse, RegisterResponse, BaseApiResponse, UploadLicenseResponse } from '../../types/api';
import { User } from '../../types/models';

export const authService = {
  requestOtp: async (phoneNumber: string, role: 'customer' = 'customer'): Promise<BaseApiResponse> => {
    const { data } = await axiosClient.post<BaseApiResponse>('/auth/registration-otp', {
      phoneNumber,
      role,
    });
    return data;
  },

  register: async (payload: any): Promise<RegisterResponse> => {
    const { data } = await axiosClient.post<RegisterResponse>('/auth/user/register', payload);
    return data;
  },

  login: async (payload: any): Promise<LoginResponse> => {
    const { data } = await axiosClient.post<LoginResponse>('/auth/user/login', payload);
    return data;
  },

  forgotPasswordOtp: async (phoneNumber: string): Promise<BaseApiResponse> => {
    const { data } = await axiosClient.post<BaseApiResponse>('/auth/user/forgot-password', {
      phoneNumber,
    });
    return data;
  },

  resetPassword: async (payload: any): Promise<BaseApiResponse> => {
    const { data } = await axiosClient.post<BaseApiResponse>('/auth/user/reset-password', payload);
    return data;
  },

  getProfile: async (): Promise<{ success: boolean; user: User }> => {
    const { data } = await axiosClient.get<{ success: boolean; user: User }>('/auth/me');
    return data;
  },

  uploadLicense: async (formData: FormData): Promise<UploadLicenseResponse> => {
    const { data } = await axiosClient.post<UploadLicenseResponse>('/auth/upload-license', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};
