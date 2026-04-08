import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { appConfigValues } from '../config/app-config';
import { ApiResponse } from '../models/auth.model';
import { OrderApi } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = appConfigValues.apiBaseUrl;

  myBuyerRequests(): Observable<OrderApi[]> {
    return this.http
      .get<ApiResponse<OrderApi[]>>(`${this.baseUrl}/orders/my-buyer-requests`)
      .pipe(map((res) => res.data));
  }

  myFarmerRequests(): Observable<OrderApi[]> {
    return this.http
      .get<ApiResponse<OrderApi[]>>(`${this.baseUrl}/orders/my-farmer-requests`)
      .pipe(map((res) => res.data));
  }

  accept(id: number): Observable<OrderApi> {
    return this.http
      .patch<ApiResponse<OrderApi>>(`${this.baseUrl}/orders/${id}/accept`, {})
      .pipe(map((res) => res.data));
  }

  reject(id: number): Observable<OrderApi> {
    return this.http
      .patch<ApiResponse<OrderApi>>(`${this.baseUrl}/orders/${id}/reject`, {})
      .pipe(map((res) => res.data));
  }

  complete(id: number): Observable<OrderApi> {
    return this.http
      .patch<ApiResponse<OrderApi>>(`${this.baseUrl}/orders/${id}/complete`, {})
      .pipe(map((res) => res.data));
  }
}
