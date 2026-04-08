import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { appConfigValues } from '../config/app-config';
import { ApiResponse } from '../models/auth.model';
import { PageResponse } from '../models/product.model';

export interface AdminStats {
  totalFarmers: number;
  totalBuyers: number;
  totalProducts: number;
  flaggedProducts: number;
  recentRegistrations: number;
}

export interface AdminUserRow {
  id: number;
  email: string;
  role: string;
  createdAt: string;
}

export interface AdminProductRow {
  id: number;
  title: string;
  moderationStatus: string;
  published: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = appConfigValues.apiBaseUrl;

  stats(): Observable<AdminStats> {
    return this.http.get<ApiResponse<AdminStats>>(`${this.baseUrl}/admin/stats`).pipe(map((res) => res.data));
  }

  users(page = 0, size = 20): Observable<PageResponse<AdminUserRow>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http
      .get<ApiResponse<PageResponse<AdminUserRow>>>(`${this.baseUrl}/admin/users`, { params })
      .pipe(map((res) => res.data));
  }

  products(page = 0, size = 20): Observable<PageResponse<AdminProductRow>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http
      .get<ApiResponse<PageResponse<AdminProductRow>>>(`${this.baseUrl}/admin/products`, { params })
      .pipe(map((res) => res.data));
  }

  flagProduct(id: number): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/admin/products/${id}/flag`, {}).pipe(map(() => undefined));
  }

  approveProduct(id: number): Observable<void> {
    return this.http
      .patch<ApiResponse<void>>(`${this.baseUrl}/admin/products/${id}/approve`, {})
      .pipe(map(() => undefined));
  }
}
