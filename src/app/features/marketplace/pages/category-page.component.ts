import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductApiService } from '../../../core/services/product-api.service';
import { toProductCard } from '../../../core/utils/product-mappers';
import { AppEmptyStateComponent } from '../../../shared/ui/empty-state/app-empty-state.component';
import { AppLoadingSpinnerComponent } from '../../../shared/ui/loading/app-loading-spinner.component';
import { AppProductCardComponent } from '../../../shared/ui/product-card/app-product-card.component';

@Component({
  selector: 'app-category-page',
  imports: [AppProductCardComponent, AppLoadingSpinnerComponent, AppEmptyStateComponent],
  template: `
    <main class="mx-auto max-w-7xl px-4 py-6">
      <h1 class="text-2xl font-semibold capitalize">{{ slug }} products</h1>
      @if (loading()) {
        <div class="mt-4"><app-loading-spinner /></div>
      } @else if (items().length === 0) {
        <div class="mt-4"><app-empty-state title="No category products" description="No products found in this category." /></div>
      } @else {
      <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        @for (item of items(); track item.id) {
          <app-product-card [product]="item" />
        }
      </div>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productApi = inject(ProductApiService);
  readonly slug = this.route.snapshot.paramMap.get('slug') ?? 'category';
  readonly loading = signal(true);
  readonly items = signal<ReturnType<typeof toProductCard>[]>([]);

  constructor() {
    this.productApi.searchPublic({ category: this.slug, page: 0, size: 24 }).subscribe({
      next: (page) => {
        this.items.set(page.content.map(toProductCard));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
