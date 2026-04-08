import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { appConfigValues } from '../config/app-config';
import { AuthApiService } from '../services/auth-api.service';
import { AuthStoreService } from '../services/auth-store.service';

export const authTokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(AuthStoreService);
  const authApi = inject(AuthApiService);
  const isApiRequest = req.url.startsWith(appConfigValues.apiBaseUrl);

  if (!isApiRequest) {
    return next(req);
  }

  const token = store.accessToken();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      const shouldRefresh =
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.endsWith('/auth/login') &&
        !req.url.endsWith('/auth/register') &&
        !req.url.endsWith('/auth/refresh');

      if (!shouldRefresh) {
        return throwError(() => error);
      }

      if (!store.refreshToken()) {
        store.logout(false);
        return throwError(() => error);
      }

      return authApi.refresh(store.refreshToken()!).pipe(
        switchMap((session) => {
          store.setSession(session);
          const retry = req.clone({ setHeaders: { Authorization: `Bearer ${session.accessToken}` } });
          return next(retry);
        }),
        catchError((refreshError) => {
          store.logout(false);
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
