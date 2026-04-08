import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse, AuthTokens, AuthUser } from '../models/auth.model';

const ACCESS_KEY = 'farmers_access_token';
const REFRESH_KEY = 'farmers_refresh_token';
const USER_KEY = 'farmers_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthStoreService {
  private readonly router = inject(Router);
  private readonly userState = signal<AuthUser | null>(this.readUser());
  private readonly accessTokenState = signal<string | null>(localStorage.getItem(ACCESS_KEY));
  private readonly refreshTokenState = signal<string | null>(localStorage.getItem(REFRESH_KEY));

  readonly user = this.userState.asReadonly();
  readonly isAuthenticated = computed(() => !!this.accessTokenState() && !!this.userState());
  readonly role = computed(() => this.userState()?.role ?? null);

  setSession(response: AuthResponse): void {
    this.userState.set({
      userId: response.userId,
      email: response.email,
      role: response.role,
    });
    this.accessTokenState.set(response.accessToken);
    this.refreshTokenState.set(response.refreshToken);
    localStorage.setItem(ACCESS_KEY, response.accessToken);
    localStorage.setItem(REFRESH_KEY, response.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(this.userState()));
  }

  updateTokens(tokens: AuthTokens): void {
    this.accessTokenState.set(tokens.accessToken);
    this.refreshTokenState.set(tokens.refreshToken);
    localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  }

  accessToken(): string | null {
    return this.accessTokenState();
  }

  refreshToken(): string | null {
    return this.refreshTokenState();
  }

  logout(redirect = true): void {
    this.userState.set(null);
    this.accessTokenState.set(null);
    this.refreshTokenState.set(null);
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    if (redirect) {
      void this.router.navigateByUrl('/auth/login');
    }
  }

  private readUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
