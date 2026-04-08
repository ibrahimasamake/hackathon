import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, from, map, Observable, switchMap } from 'rxjs';
import { appConfigValues } from '../config/app-config';
import { ApiResponse } from '../models/auth.model';

interface UploadUrlResponse {
  objectKey: string;
  uploadUrl: string;
  publicUrl: string;
  method: string;
}

@Injectable({ providedIn: 'root' })
export class StorageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = appConfigValues.apiBaseUrl;
  private readonly r2PublicUrl = (appConfigValues.r2PublicUrl || '').replace(/\/+$/, '');
  private readonly r2Bucket = (appConfigValues.r2Bucket || '').replace(/^\/+|\/+$/g, '');
  private readonly useDirectBackendUpload =
    typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);

  uploadProductImage(productId: number, file: File, primary: boolean, position: number): Observable<number> {
    if (this.useDirectBackendUpload) {
      return this.uploadViaBackend(productId, file, primary, position);
    }
    return this.http
      .post<ApiResponse<UploadUrlResponse>>(`${this.baseUrl}/storage/product-image/upload-url`, {
        productId,
        fileName: file.name,
        mimeType: (file.type || 'image/webp').split(';')[0],
        sizeBytes: file.size,
      })
      .pipe(
        switchMap((res) => from(this.putFileToR2(res.data.uploadUrl, file)).pipe(
          switchMap(() =>
            this.http.post<ApiResponse<number>>(`${this.baseUrl}/storage/product-image/confirm`, {
              productId,
              objectKey: res.data.objectKey,
              publicUrl: this.toPublicUrl(res.data.uploadUrl, res.data.publicUrl),
              mimeType: (file.type || 'image/webp').split(';')[0],
              sizeBytes: file.size,
              primary,
              position,
            }),
          ),
        )),
        map((confirmRes) => confirmRes.data),
        catchError(() => this.uploadViaBackend(productId, file, primary, position)),
      );
  }

  private async putFileToR2(uploadUrl: string, file: File, timeoutMs = 600000): Promise<void> {
    const contentType = (file.type || 'image/webp').split(';')[0];
    const response = (await Promise.race([
      fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=604800',
        },
      }),
      new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('R2 upload timeout')), timeoutMs)),
    ])) as Response;

    if (!response.ok) {
      throw new Error(`R2 upload failed: ${response.status} ${response.statusText}`);
    }
  }

  private toPublicUrl(uploadUrl: string, fallbackPublicUrl: string): string {
    const rawUrl = (uploadUrl || '').split('?')[0];
    if (!rawUrl || !this.r2PublicUrl) {
      return fallbackPublicUrl || rawUrl;
    }
    try {
      const parsed = new URL(rawUrl);
      let path = parsed.pathname.replace(/^\/+/, '');
      if (this.r2Bucket && path.startsWith(`${this.r2Bucket}/`)) {
        path = path.slice(this.r2Bucket.length + 1);
      }
      return `${this.r2PublicUrl}/${path}`;
    } catch {
      return fallbackPublicUrl || rawUrl;
    }
  }

  private uploadViaBackend(productId: number, file: File, primary: boolean, position: number): Observable<number> {
    const form = new FormData();
    form.append('productId', `${productId}`);
    form.append('primary', `${primary}`);
    form.append('position', `${position}`);
    form.append('file', file, file.name);
    return this.http
      .post<ApiResponse<number>>(`${this.baseUrl}/storage/product-image/upload`, form)
      .pipe(map((res) => res.data));
  }
}
