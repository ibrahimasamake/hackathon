import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProductApi } from '../../../core/models/product.model';
import { ProductApiService } from '../../../core/services/product-api.service';
import { toProductCard } from '../../../core/utils/product-mappers';
import { AppBadgeComponent } from '../../../shared/ui/badge/app-badge.component';
import { AppButtonComponent } from '../../../shared/ui/button/app-button.component';
import { AppEmptyStateComponent } from '../../../shared/ui/empty-state/app-empty-state.component';
import { AppLoadingSpinnerComponent } from '../../../shared/ui/loading/app-loading-spinner.component';
import { AppProductCardComponent } from '../../../shared/ui/product-card/app-product-card.component';

@Component({
  selector: 'app-product-detail-page',
  imports: [
    RouterLink,
    AppBadgeComponent,
    AppButtonComponent,
    AppProductCardComponent,
    AppLoadingSpinnerComponent,
    AppEmptyStateComponent,
  ],
  template: `
    <main class="mx-auto max-w-5xl px-4 py-6">
      <a routerLink="/marketplace" class="text-sm text-primary">← Back to marketplace</a>
      @if (loading()) {
        <div class="mt-6"><app-loading-spinner /></div>
      } @else if (!product()) {
        <div class="mt-6"><app-empty-state title="Product not found" description="This product is not available." /></div>
      } @else {
      <section class="mt-4 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div class="space-y-3">
          <img [src]="mainImage()" [alt]="product()!.title" class="h-72 w-full rounded-2xl object-cover" />
          <div class="grid grid-cols-4 gap-2">
            @for (img of imageThumbs(); track img) {
              <img [src]="img" alt="thumb" class="h-20 w-full rounded-xl object-cover" />
            }
          </div>
        </div>
        <div class="space-y-4 rounded-2xl border border-border bg-surface p-5">
          <app-badge tone="success">Fresh harvest</app-badge>
          <h1 class="text-2xl font-semibold">{{ product()!.title }}</h1>
          <p class="text-muted-foreground">{{ product()!.description }}</p>
          <p class="text-lg font-bold">{{ product()!.currency }} {{ product()!.price }} / {{ product()!.unit.toLowerCase() }}</p>
          <p class="text-sm text-muted-foreground">Stock: {{ product()!.quantity }} {{ product()!.unit.toLowerCase() }} • {{ product()!.location }}</p>
          <div class="space-y-2 rounded-xl border border-border p-3">
            <p class="text-sm font-semibold">Ask AI about this product</p>
            <p class="text-xs text-muted-foreground">“Is this suitable for today’s dinner quantity of 5kg?”</p>
            <a routerLink="/ai-market-assistant"><app-button variant="outline">Open AI assistant</app-button></a>
          </div>
          <div class="flex gap-2">
            <app-button>Send order request</app-button>
            <app-button variant="outline">Contact farmer</app-button>
          </div>
        </div>
      </section>
      }

      <section class="mt-8">
        <h2 class="text-lg font-semibold">Related products</h2>
        @if (related().length === 0) {
          <p class="mt-3 text-sm text-muted-foreground">No related products yet.</p>
        } @else {
        <div class="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (item of related(); track item.id) {
            <app-product-card [product]="item" />
          }
        </div>
        }
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productApi = inject(ProductApiService);
  readonly productId = Number(this.route.snapshot.paramMap.get('id'));
  readonly loading = signal(false);
  readonly product = signal<ProductApi | null>(null);
  readonly related = signal<ReturnType<typeof toProductCard>[]>([]);

  constructor() {
    this.load();
  }

  mainImage(): string {
    return this.product()?.images.find((img) => img.isPrimary)?.publicUrl
      ?? this.product()?.images[0]?.publicUrl
      ?? 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800';
  }

  imageThumbs(): string[] {
    return this.product()?.images.map((img) => img.publicUrl).slice(0, 4) ?? [this.mainImage()];
  }

  private load(): void {
    if (!this.productId) {
      return;
    }
    this.loading.set(true);
    this.productApi.byId(this.productId).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (product) => this.product.set(product),
    });
    this.productApi.related(this.productId).subscribe({
      next: (products) => this.related.set(products.map(toProductCard)),
    });
  }
}
