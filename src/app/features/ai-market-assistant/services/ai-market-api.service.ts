import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { appConfigValues } from '../../../core/config/app-config';
import { ApiResponse } from '../../../core/models/auth.model';
import { ProductCardModel } from '../../../shared/types/marketplace.types';

export interface AiMarketResponse {
  detectedLanguage: string;
  assistantMessage: string;
  followUpSuggestions: string[];
  products: Array<{
    id: number;
    title: string;
    farmerName: string;
    location: string;
    price: number;
    currency: string;
    unit: string;
    quantity: number;
    images: Array<{ publicUrl: string }>;
  }>;
}

@Injectable({ providedIn: 'root' })
export class AiMarketApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = appConfigValues.apiBaseUrl;

  query(message: string, languageHint: string): Observable<AiMarketResponse> {
    return this.http
      .post<ApiResponse<AiMarketResponse>>(`${this.baseUrl}/ai/market/query`, { message, languageHint })
      .pipe(map((res) => res.data));
  }

  suggestions(languageHint: string): Observable<string[]> {
    return this.http
      .get<ApiResponse<string[]>>(`${this.baseUrl}/ai/market/suggestions`, { params: { languageHint } })
      .pipe(map((res) => res.data));
  }

  toCards(response: AiMarketResponse): ProductCardModel[] {
    return response.products.map((item) => ({
      id: item.id,
      title: item.title,
      farmerName: item.farmerName,
      location: item.location,
      price: item.price,
      currency: item.currency,
      unit: item.unit,
      quantity: item.quantity,
      imageUrl: item.images[0]?.publicUrl ?? 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
      freshnessLabel: 'Fresh',
    }));
  }
}
