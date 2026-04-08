import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AdminApiService, AdminProductRow } from '../../../core/services/admin-api.service';
import { AppBadgeComponent } from '../../../shared/ui/badge/app-badge.component';
import { AppButtonComponent } from '../../../shared/ui/button/app-button.component';
import { AppLoadingSpinnerComponent } from '../../../shared/ui/loading/app-loading-spinner.component';
import { AppPageHeaderComponent } from '../../../shared/ui/page-header/app-page-header.component';

@Component({
  selector: 'app-admin-products-moderation-page',
  imports: [AppPageHeaderComponent, AppBadgeComponent, AppButtonComponent, AppLoadingSpinnerComponent],
  template: `
    <main class="mx-auto max-w-6xl px-4 py-6">
      <app-page-header title="Product moderation" subtitle="Approve or flag suspicious listings" />
      @if (loading()) {
        <app-loading-spinner />
      } @else {
        <div class="space-y-3">
          @for (item of products(); track item.id) {
            <article class="rounded-2xl border border-border bg-surface p-4">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <h3 class="font-semibold">{{ item.title }}</h3>
                  <p class="text-sm text-muted-foreground">ID #{{ item.id }} • published: {{ item.published }}</p>
                </div>
                <app-badge [tone]="item.moderationStatus === 'FLAGGED' ? 'danger' : item.moderationStatus === 'PENDING' ? 'warning' : 'success'">
                  {{ item.moderationStatus }}
                </app-badge>
              </div>
              <div class="mt-3 flex gap-2">
                <app-button (click)="approve(item.id)">Approve</app-button>
                <app-button variant="outline" (click)="flag(item.id)">Flag</app-button>
              </div>
            </article>
          }
        </div>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductsModerationPageComponent {
  private readonly adminApi = inject(AdminApiService);
  readonly loading = signal(true);
  readonly products = signal<AdminProductRow[]>([]);

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.adminApi.products(0, 50).subscribe({
      next: (page) => {
        this.products.set(page.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  approve(id: number): void {
    this.adminApi.approveProduct(id).subscribe({ next: () => this.refresh() });
  }

  flag(id: number): void {
    this.adminApi.flagProduct(id).subscribe({ next: () => this.refresh() });
  }
}
