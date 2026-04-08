import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthStoreService } from '../../core/services/auth-store.service';
import { AppHeaderComponent } from '../../shared/ui/app-header/app-header.component';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, RouterLink, AppHeaderComponent],
  template: `
    <div class="min-h-screen bg-background">
      <app-header mode="dashboard" />
      <div class="mx-auto grid max-w-7xl gap-4 px-4 pb-4 pt-[76px] lg:grid-cols-[240px_1fr]">
        <aside class="hidden rounded-2xl border border-border bg-surface p-4 lg:block">
          <p class="mb-4 text-sm font-semibold text-primary">Farmer Console</p>
          <nav class="space-y-1 text-sm">
            <a routerLink="/app/dashboard" class="block rounded-lg px-3 py-2 hover:bg-muted">Dashboard</a>
            <a routerLink="/products" class="block rounded-lg px-3 py-2 hover:bg-muted">My Products</a>
            <a routerLink="/products/new" class="block rounded-lg px-3 py-2 hover:bg-muted">Create Product</a>
            <a routerLink="/orders" class="block rounded-lg px-3 py-2 hover:bg-muted">Orders</a>
            <a routerLink="/app/profile" class="block rounded-lg px-3 py-2 hover:bg-muted">Profile</a>
            <a routerLink="/admin/dashboard" class="block rounded-lg px-3 py-2 hover:bg-muted">Admin</a>
            <button class="mt-2 w-full rounded-lg border border-border px-3 py-2 text-left" (click)="logout()">Logout</button>
          </nav>
        </aside>
        <main class="min-w-0">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {
  private readonly authStore = inject(AuthStoreService);
  private readonly router = inject(Router);

  logout(): void {
    this.authStore.logout(false);
    void this.router.navigateByUrl('/');
  }
}
