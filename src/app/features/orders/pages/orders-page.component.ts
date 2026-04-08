import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { OrderApiService } from '../../../core/services/order-api.service';
import { AppBadgeComponent } from '../../../shared/ui/badge/app-badge.component';
import { AppEmptyStateComponent } from '../../../shared/ui/empty-state/app-empty-state.component';
import { AppLoadingSpinnerComponent } from '../../../shared/ui/loading/app-loading-spinner.component';
import { AppPageHeaderComponent } from '../../../shared/ui/page-header/app-page-header.component';

@Component({
  selector: 'app-orders-page',
  imports: [AppPageHeaderComponent, AppBadgeComponent, AppLoadingSpinnerComponent, AppEmptyStateComponent],
  template: `
    <main class="mx-auto max-w-5xl px-4 py-6">
      <app-page-header title="Orders" subtitle="Buyer requests and farmer responses" />
      <div class="mb-3 flex gap-2">
        <button class="rounded-full border border-border px-3 py-1 text-xs" (click)="tab.set('pending')">Pending</button>
        <button class="rounded-full border border-border px-3 py-1 text-xs" (click)="tab.set('accepted')">Accepted</button>
        <button class="rounded-full border border-border px-3 py-1 text-xs" (click)="tab.set('rejected')">Rejected</button>
        <button class="rounded-full border border-border px-3 py-1 text-xs" (click)="tab.set('completed')">Completed</button>
      </div>
      @if (loading()) {
        <app-loading-spinner />
      } @else if (filteredOrders().length === 0) {
        <app-empty-state title="No orders" description="No requests for this status yet." />
      } @else {
      <div class="overflow-hidden rounded-2xl border border-border bg-surface">
        <table class="w-full text-left text-sm">
          <thead class="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr><th class="px-4 py-3">Product</th><th class="px-4 py-3">Qty</th><th class="px-4 py-3">Status</th><th class="px-4 py-3">Action</th></tr>
          </thead>
          <tbody>
            @for (order of filteredOrders(); track order.id) {
              <tr class="border-t border-border">
                <td class="px-4 py-3">{{ order.productTitle }}</td>
                <td class="px-4 py-3">{{ order.quantity }}</td>
                <td class="px-4 py-3">
                  <app-badge [tone]="order.status === 'REJECTED' ? 'danger' : order.status === 'PENDING' ? 'warning' : 'success'">
                    {{ order.status }}
                  </app-badge>
                </td>
                <td class="px-4 py-3">
                  @if (isFarmer() && order.status === 'PENDING') {
                    <div class="flex gap-1">
                      <button class="rounded-lg border border-border px-2 py-1 text-xs" (click)="accept(order.id)">Accept</button>
                      <button class="rounded-lg border border-border px-2 py-1 text-xs" (click)="reject(order.id)">Reject</button>
                    </div>
                  } @else if (isFarmer() && order.status === 'ACCEPTED') {
                    <button class="rounded-lg border border-border px-2 py-1 text-xs" (click)="complete(order.id)">Complete</button>
                  } @else {
                    <span class="text-xs text-muted-foreground">-</span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent {
  private readonly orderApi = inject(OrderApiService);
  private readonly authStore = inject(AuthStoreService);
  readonly tab = signal<'pending' | 'accepted' | 'rejected' | 'completed'>('pending');
  readonly loading = signal(false);
  readonly orders = signal<import('../../../core/models/order.model').OrderApi[]>([]);
  readonly isFarmer = computed(() => {
    const role = this.authStore.role();
    return role === 'ROLE_FARMER' || role === 'ROLE_ADMIN';
  });
  readonly filteredOrders = computed(() => {
    const wanted = this.tab().toUpperCase();
    return this.orders().filter((item) => item.status === wanted);
  });

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    const source$ = this.isFarmer() ? this.orderApi.myFarmerRequests() : this.orderApi.myBuyerRequests();
    source$.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (orders) => this.orders.set(orders),
    });
  }

  accept(id: number): void {
    this.orderApi.accept(id).subscribe({ next: () => this.refresh() });
  }

  reject(id: number): void {
    this.orderApi.reject(id).subscribe({ next: () => this.refresh() });
  }

  complete(id: number): void {
    this.orderApi.complete(id).subscribe({ next: () => this.refresh() });
  }
}
