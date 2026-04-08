import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { appConfigValues } from '../config/app-config';
import { ApiResponse, AuthResponse, UserRole } from '../models/auth.model';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = appConfigValues.apiBaseUrl;

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.baseUrl}/auth/login`, payload)
      .pipe(map((res) => res.data));
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.baseUrl}/auth/register`, payload)
      .pipe(map((res) => res.data));
  }

  refresh(refreshToken: string): Observable<AuthResponse> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.baseUrl}/auth/refresh`, { refreshToken })
      .pipe(map((res) => res.data));
  }
}
