import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: { phoneNumber?: string } | undefined;
  ForgotPassword: { phoneNumber?: string } | undefined;
  ResetPassword: { phoneNumber: string } | undefined;
};

export type MainTabParamList = {
  Explore: undefined;
  MyBookings: undefined;
  Support: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  VehicleDetails: { vehicleId: string };
  CheckoutModal: { bookingId: string };
  LicenseUpload: undefined;
  WriteReview: { bookingId: string; vehicleId: string };
  TermsAndPolicies: { policyType: 'terms' | 'privacy' | 'cancellation' | 'insurance' };
};
