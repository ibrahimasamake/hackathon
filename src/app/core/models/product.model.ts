import { ApiResponse } from './auth.model';

export type AvailabilityStatus = 'AVAILABLE' | 'UNAVAILABLE';

export interface ProductImageApi {
  id: number;
  publicUrl: string;
  isPrimary: boolean;
  position: number;
}

export interface ProductApi {
  id: number;
  farmerId: number;
  farmerName: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  quantity: number;
  unit: string;
  harvestDate: string | null;
  location: string;
  availabilityStatus: AvailabilityStatus;
  published: boolean;
  moderationStatus: string;
  tags: string | null;
  images: ProductImageApi[];
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type ProductPageApiResponse = ApiResponse<PageResponse<ProductApi>>;
