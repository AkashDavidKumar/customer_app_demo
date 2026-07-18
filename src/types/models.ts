export type UserRole = 'customer' | 'admin';

export type LicenseStatus = 'unverified' | 'pending' | 'approved' | 'rejected';

export interface DrivingLicense {
  number?: string;
  imageUrl?: string;
  aadhaarImageUrl?: string;
  collegeIdImageUrl?: string;
  status: LicenseStatus;
  rejectionReason?: string;
}

export interface User {
  _id: string;
  phoneNumber: string;
  fullName?: string;
  role: UserRole;
  isPhoneVerified: boolean;
  drivingLicense: DrivingLicense;
}

export type VehicleType = 'CAR' | 'BIKE' | 'SCOOTY';

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface VehiclePricing {
  hourlyRate: number;
  dailyRate: number;
  weeklyRate: number;
}

export interface VehicleDocument {
  url: string;
  mimeType: string;
  originalName: string;
}

export interface VehicleDocuments {
  kycDocument?: VehicleDocument;
  vehicleRC?: VehicleDocument;
  insuranceWithPhoto?: VehicleDocument;
  vehiclePUC?: VehicleDocument;
}

export interface Vehicle {
  _id: string;
  franchiseId: string;
  vehicleType: VehicleType;
  makeAndModel: string;
  registrationNumber: string;
  imageUrls: string[];
  fuelType: string;
  seats: number;
  year: number;
  features: string[];
  pricing: VehiclePricing;
  documents?: VehicleDocuments;
  reviewStatus: ReviewStatus;
  isAvailable: boolean;
}

export type BookingStatus = 'PAYMENT_PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface PricingDetails {
  totalAmount: number;
  depositAmount: number;
  balanceDueAtPickup: number;
}

export interface Booking {
  _id: string;
  userId: string;
  vehicleId: string | Vehicle;
  franchiseId: string;
  pickupTime: string; // ISO date string
  dropTime: string; // ISO date string
  pricingDetails: PricingDetails;
  addons: string[];
  status: BookingStatus;
  lockedUntil?: string; // ISO date string
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  userId: string | { _id: string; fullName: string };
  vehicleId: string;
  bookingId: string;
  rating: number; // 1-5
  comment: string;
  status: ReviewStatus;
  createdAt?: string;
}

export type DiscountType = 'PERCENTAGE' | 'FLAT';

export interface Coupon {
  _id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number | null;
  minBookingAmount: number;
  expiryDate: string; // ISO date string
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
}
