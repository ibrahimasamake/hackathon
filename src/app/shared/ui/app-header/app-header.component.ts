import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { I18nService } from '../../../core/i18n/i18n.service';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { AppButtonComponent } from '../button/app-button.component';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AppButtonComponent, LanguageSwitcherComponent],
  template: `
    <header class="fixed inset-x-0 top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <a routerLink="/" class="text-sm font-bold tracking-wide text-primary">Krishi Voice Market</a>

        @if (mode() === 'public') {
          <nav class="hidden items-center gap-5 text-sm md:flex">
            <a routerLink="/">{{ i18n.t('home') }}</a>
            <a routerLink="/marketplace">{{ i18n.t('marketplace') }}</a>
            <a routerLink="/#categories">{{ i18n.t('categories') }}</a>
            <a routerLink="/ai-market-assistant">{{ i18n.t('aiSearch') }}</a>
            <a routerLink="/#farmers">Farmers</a>
            <a routerLink="/#help">Help</a>
          </nav>
        } @else {
          <nav class="hidden items-center gap-5 text-sm md:flex">
            <a routerLink="/app/dashboard">Dashboard</a>
            <a routerLink="/products">Products</a>
            <a routerLink="/products/new">Create</a>
            <a routerLink="/orders">Orders</a>
            <a routerLink="/app/profile">Profile</a>
          </nav>
        }

        <div class="hidden items-center gap-2 md:flex">
          <app-language-switcher />
          <a routerLink="/ai-market-assistant"><app-button variant="outline">Install App</app-button></a>
          @if (authStore.isAuthenticated()) {
            <span class="max-w-44 truncate text-xs text-muted-foreground">{{ userEmail() }}</span>
            <app-button variant="outline" (click)="logout()">Logout</app-button>
          } @else {
            <a routerLink="/auth/login"><app-button variant="outline">{{ i18n.t('login') }}</app-button></a>
            <a routerLink="/auth/register"><app-button>{{ i18n.t('register') }}</app-button></a>
          }
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent {
  readonly mode = input<'public' | 'dashboard'>('public');
  readonly i18n = inject(I18nService);
  readonly authStore = inject(AuthStoreService);
  private readonly router = inject(Router);
  readonly userEmail = computed(() => this.authStore.user()?.email ?? '');

  logout(): void {
    this.authStore.logout(false);
    void this.router.navigateByUrl('/');
  }
}
