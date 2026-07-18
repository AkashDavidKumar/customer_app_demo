import { User, Vehicle, Booking, Coupon, Review } from './models';

export interface BaseApiResponse {
  success: boolean;
  message?: string;
}

export interface ApiDataResponse<T> extends BaseApiResponse {
  data: T;
}

export interface LoginResponse extends BaseApiResponse {
  token: string;
  role: string;
  user: {
    _id: string;
    drivingLicense: {
      status: User['drivingLicense']['status'];
    };
  };
}

export interface RegisterResponse extends BaseApiResponse {
  token: string;
  user: User;
}

export interface UploadLicenseResponse extends BaseApiResponse {
  data: {
    drivingLicense: {
      number: string;
      status: User['drivingLicense']['status'];
    };
  };
}

export interface LocationHub {
  state: string;
  district: string;
  hub_city: string;
  pickup_address: string;
}

export interface LocationsResponse extends BaseApiResponse {
  data: LocationHub[];
}

export interface ValidateCouponRequest {
  code: string;
  bookingAmount: number;
}

export interface ValidateCouponResponse extends BaseApiResponse {
  coupon: Coupon;
}

export interface ReviewResponse extends BaseApiResponse {
  data: Review[];
}
