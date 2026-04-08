import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AdminApiService, AdminStats } from '../../../core/services/admin-api.service';
import { AppCardComponent } from '../../../shared/ui/card/app-card.component';
import { AppLoadingSpinnerComponent } from '../../../shared/ui/loading/app-loading-spinner.component';
import { AppPageHeaderComponent } from '../../../shared/ui/page-header/app-page-header.component';

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [AppPageHeaderComponent, AppCardComponent, AppLoadingSpinnerComponent],
  template: `
    <main class="mx-auto max-w-6xl px-4 py-6">
      <app-page-header title="Admin dashboard" subtitle="Moderation and ecosystem overview" />
      @if (loading()) {
        <app-loading-spinner />
      } @else {
      <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <app-card><p class="text-xs text-muted-foreground">Total farmers</p><p class="text-xl font-semibold">{{ stats()?.totalFarmers ?? 0 }}</p></app-card>
        <app-card><p class="text-xs text-muted-foreground">Total buyers</p><p class="text-xl font-semibold">{{ stats()?.totalBuyers ?? 0 }}</p></app-card>
        <app-card><p class="text-xs text-muted-foreground">Total products</p><p class="text-xl font-semibold">{{ stats()?.totalProducts ?? 0 }}</p></app-card>
        <app-card><p class="text-xs text-muted-foreground">Flagged</p><p class="text-xl font-semibold">{{ stats()?.flaggedProducts ?? 0 }}</p></app-card>
        <app-card><p class="text-xs text-muted-foreground">Recent signups</p><p class="text-xl font-semibold">{{ stats()?.recentRegistrations ?? 0 }}</p></app-card>
      </section>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardPageComponent {
  private readonly adminApi = inject(AdminApiService);
  readonly loading = signal(true);
  readonly stats = signal<AdminStats | null>(null);

  constructor() {
    this.adminApi.stats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
