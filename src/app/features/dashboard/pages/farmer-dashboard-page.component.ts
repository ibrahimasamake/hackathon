import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { combineLatest } from 'rxjs';
import { FarmerApiService } from '../../../core/services/farmer-api.service';
import { OrderApiService } from '../../../core/services/order-api.service';
import { ProductApiService } from '../../../core/services/product-api.service';
import { AppCardComponent } from '../../../shared/ui/card/app-card.component';
import { AppLoadingSpinnerComponent } from '../../../shared/ui/loading/app-loading-spinner.component';
import { AppPageHeaderComponent } from '../../../shared/ui/page-header/app-page-header.component';

@Component({
  selector: 'app-farmer-dashboard-page',
  imports: [AppCardComponent, AppPageHeaderComponent, AppLoadingSpinnerComponent],
  template: `
    <main class="mx-auto max-w-6xl px-4 py-6">
      <app-page-header title="Farmer Dashboard" subtitle="Today overview and quick actions" />
      @if (loading()) {
        <app-loading-spinner />
      } @else {
      <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <app-card><p class="text-xs text-muted-foreground">Total products</p><p class="text-2xl font-semibold">{{ totalProducts() }}</p></app-card>
        <app-card><p class="text-xs text-muted-foreground">Available stock</p><p class="text-2xl font-semibold">{{ totalQuantity() }}</p><p class="text-xs text-amber-600">{{ lowStock() }} low-stock alerts</p></app-card>
        <app-card><p class="text-xs text-muted-foreground">Pending requests</p><p class="text-2xl font-semibold">{{ pendingRequests() }}</p></app-card>
        <app-card><p class="text-xs text-muted-foreground">Accepted requests</p><p class="text-2xl font-semibold">{{ acceptedRequests() }}</p></app-card>
      </section>

      <section class="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <app-card>
          <h3 class="mb-3 text-sm font-semibold">Recent requests</h3>
          <div class="space-y-2 text-sm">
            @for (order of recentOrders(); track order.id) {
              <div class="flex items-center justify-between rounded-lg border border-border p-2">
                <span>{{ order.productTitle }} • {{ order.quantity }}</span>
                <span [class]="order.status === 'PENDING' ? 'text-amber-600' : order.status === 'ACCEPTED' ? 'text-green-700' : 'text-red-600'">
                  {{ order.status }}
                </span>
              </div>
            }
          </div>
        </app-card>
        <app-card>
          <h3 class="mb-3 text-sm font-semibold">Quick actions</h3>
          <div class="grid gap-2 text-sm">
            <a href="/products/new" class="rounded-lg border border-border px-3 py-2">+ Create product</a>
            <a href="/products" class="rounded-lg border border-border px-3 py-2">Manage inventory</a>
            <a href="/orders" class="rounded-lg border border-border px-3 py-2">Open pending requests</a>
          </div>
        </app-card>
      </section>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FarmerDashboardPageComponent {
  private readonly productApi = inject(ProductApiService);
  private readonly orderApi = inject(OrderApiService);
  private readonly farmerApi = inject(FarmerApiService);
  readonly loading = signal(true);
  readonly products = signal<import('../../../core/models/product.model').ProductApi[]>([]);
  readonly orders = signal<import('../../../core/models/order.model').OrderApi[]>([]);

  readonly totalProducts = computed(() => this.products().length);
  readonly totalQuantity = computed(() =>
    this.products().reduce((acc, item) => acc + Number(item.quantity), 0).toFixed(0),
  );
  readonly lowStock = computed(() => this.products().filter((item) => Number(item.quantity) < 20).length);
  readonly pendingRequests = computed(() => this.orders().filter((item) => item.status === 'PENDING').length);
  readonly acceptedRequests = computed(() => this.orders().filter((item) => item.status === 'ACCEPTED').length);
  readonly recentOrders = computed(() => this.orders().slice(0, 5));

  constructor() {
    combineLatest([this.productApi.myProducts(), this.orderApi.myFarmerRequests(), this.farmerApi.getMyProfile()]).subscribe({
      next: ([products, orders]) => {
        this.products.set(products);
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
