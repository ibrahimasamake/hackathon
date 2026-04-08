import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FarmerApiService } from '../../../core/services/farmer-api.service';
import { ProductApiService } from '../../../core/services/product-api.service';
import { toProductCard } from '../../../core/utils/product-mappers';
import { AppEmptyStateComponent } from '../../../shared/ui/empty-state/app-empty-state.component';
import { AppLoadingSpinnerComponent } from '../../../shared/ui/loading/app-loading-spinner.component';
import { AppFarmerCardComponent } from '../../../shared/ui/farmer-card/app-farmer-card.component';
import { AppProductCardComponent } from '../../../shared/ui/product-card/app-product-card.component';

@Component({
  selector: 'app-farmer-public-profile-page',
  imports: [AppFarmerCardComponent, AppProductCardComponent, AppLoadingSpinnerComponent, AppEmptyStateComponent],
  template: `
    <main class="mx-auto max-w-4xl px-4 py-6">
      <h1 class="text-2xl font-semibold">Farmer Profile</h1>
      @if (loading()) {
        <div class="mt-4"><app-loading-spinner /></div>
      } @else if (!farmer()) {
        <div class="mt-4"><app-empty-state title="Farmer not found" description="This farmer profile is unavailable." /></div>
      } @else {
      <section class="mt-4">
        <app-farmer-card
          [farmer]="{
            id: farmer()!.id,
            farmName: farmer()!.farmName,
            ownerName: farmer()!.fullName,
            region: farmer()!.region,
            verified: farmer()!.verified
          }"
        />
      </section>
      }
      <section class="mt-6">
        <h2 class="text-lg font-semibold">Products by this farmer</h2>
        @if (products().length === 0) {
          <p class="mt-3 text-sm text-muted-foreground">No published products from this farmer.</p>
        } @else {
        <div class="mt-3 grid gap-4 sm:grid-cols-2">
          @for (item of products(); track item.id) {
            <app-product-card [product]="item" />
          }
        </div>
        }
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FarmerPublicProfilePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly farmerApi = inject(FarmerApiService);
  private readonly productApi = inject(ProductApiService);
  readonly farmerId = Number(this.route.snapshot.paramMap.get('id'));
  readonly loading = signal(false);
  readonly farmer = signal<import('../../../core/models/farmer.model').FarmerProfileApi | null>(null);
  readonly products = signal<ReturnType<typeof toProductCard>[]>([]);

  constructor() {
    this.load();
  }

  private load(): void {
    if (!this.farmerId) {
      return;
    }
    this.loading.set(true);
    this.farmerApi.getById(this.farmerId).subscribe({
      next: (farmer) => {
        this.farmer.set(farmer);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.productApi.byFarmer(this.farmerId).subscribe({
      next: (products) => this.products.set(products.map(toProductCard)),
    });
  }
}
