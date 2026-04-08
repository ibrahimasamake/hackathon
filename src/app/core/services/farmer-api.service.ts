import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { appConfigValues } from '../config/app-config';
import { ApiResponse } from '../models/auth.model';
import { FarmerProfileApi } from '../models/farmer.model';

@Injectable({ providedIn: 'root' })
export class FarmerApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = appConfigValues.apiBaseUrl;

  getMyProfile(): Observable<FarmerProfileApi> {
    return this.http
      .get<ApiResponse<FarmerProfileApi>>(`${this.baseUrl}/farmers/me`)
      .pipe(map((res) => res.data));
  }

  updateMyProfile(payload: Omit<FarmerProfileApi, 'id' | 'userId' | 'verified'>): Observable<FarmerProfileApi> {
    return this.http
      .put<ApiResponse<FarmerProfileApi>>(`${this.baseUrl}/farmers/me`, payload)
      .pipe(map((res) => res.data));
  }

  getById(id: number): Observable<FarmerProfileApi> {
    return this.http
      .get<ApiResponse<FarmerProfileApi>>(`${this.baseUrl}/farmers/${id}`)
      .pipe(map((res) => res.data));
  }
}
