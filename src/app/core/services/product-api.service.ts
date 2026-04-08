import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { appConfigValues } from '../config/app-config';
import { ApiResponse } from '../models/auth.model';
import { PageResponse, ProductApi } from '../models/product.model';

export interface ProductSearchParams {
  q?: string;
  category?: string;
  location?: string;
  availability?: 'AVAILABLE' | 'UNAVAILABLE';
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'freshest';
  page?: number;
  size?: number;
}

export interface SaveProductPayload {
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  quantity: number;
  unit: 'KG' | 'BAG' | 'BASKET' | 'PIECE' | 'TON';
  harvestDate: string | null;
  location: string;
  availabilityStatus: 'AVAILABLE' | 'UNAVAILABLE';
  tags: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = appConfigValues.apiBaseUrl;

  searchPublic(params: ProductSearchParams): Observable<PageResponse<ProductApi>> {
    let query = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && `${value}`.trim() !== '') {
        query = query.set(key, `${value}`);
      }
    });
    return this.http
      .get<ApiResponse<PageResponse<ProductApi>>>(`${this.baseUrl}/public/products`, { params: query })
      .pipe(map((res) => res.data));
  }

  featured(): Observable<ProductApi[]> {
    return this.http
      .get<ApiResponse<ProductApi[]>>(`${this.baseUrl}/public/products/featured`)
      .pipe(map((res) => res.data));
  }

  byFarmer(farmerId: number): Observable<ProductApi[]> {
    return this.http
      .get<ApiResponse<ProductApi[]>>(`${this.baseUrl}/public/farmers/${farmerId}/products`)
      .pipe(map((res) => res.data));
  }

  byId(id: number): Observable<ProductApi> {
    return this.http.get<ApiResponse<ProductApi>>(`${this.baseUrl}/products/${id}`).pipe(map((res) => res.data));
  }

  related(id: number): Observable<ProductApi[]> {
    return this.http
      .get<ApiResponse<ProductApi[]>>(`${this.baseUrl}/public/products/${id}/related`)
      .pipe(map((res) => res.data));
  }

  myProducts(): Observable<ProductApi[]> {
    return this.http
      .get<ApiResponse<ProductApi[]>>(`${this.baseUrl}/products/my`)
      .pipe(map((res) => res.data));
  }

  create(payload: SaveProductPayload): Observable<ProductApi> {
    return this.http.post<ApiResponse<ProductApi>>(`${this.baseUrl}/products`, payload).pipe(map((res) => res.data));
  }

  update(id: number, payload: SaveProductPayload): Observable<ProductApi> {
    return this.http.put<ApiResponse<ProductApi>>(`${this.baseUrl}/products/${id}`, payload).pipe(map((res) => res.data));
  }

  publish(id: number): Observable<ProductApi> {
    return this.http
      .patch<ApiResponse<ProductApi>>(`${this.baseUrl}/products/${id}/publish`, {})
      .pipe(map((res) => res.data));
  }

  unpublish(id: number): Observable<ProductApi> {
    return this.http
      .patch<ApiResponse<ProductApi>>(`${this.baseUrl}/products/${id}/unpublish`, {})
      .pipe(map((res) => res.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/products/${id}`).pipe(map(() => undefined));
  }
}
