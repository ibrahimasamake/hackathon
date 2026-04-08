import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ProductApiService } from '../../../core/services/product-api.service';
import { toProductCard } from '../../../core/utils/product-mappers';
import { RouterLink } from '@angular/router';
import { AppButtonComponent } from '../../../shared/ui/button/app-button.component';
import { AppEmptyStateComponent } from '../../../shared/ui/empty-state/app-empty-state.component';
import { AppLoadingSpinnerComponent } from '../../../shared/ui/loading/app-loading-spinner.component';
import { AppPageHeaderComponent } from '../../../shared/ui/page-header/app-page-header.component';
import { AppProductCardComponent } from '../../../shared/ui/product-card/app-product-card.component';
import { ProductCardModel } from '../../../shared/types/marketplace.types';
import { ProductApi } from '../../../core/models/product.model';

@Component({
  selector: 'app-my-products-page',
  imports: [
    RouterLink,
    AppPageHeaderComponent,
    AppButtonComponent,
    AppEmptyStateComponent,
    AppProductCardComponent,
    AppLoadingSpinnerComponent,
  ],
  template: `
    <main class="mx-auto max-w-6xl px-4 py-6">
      <app-page-header title="My products" subtitle="Manage listings and stock">
        <a routerLink="/products/new"><app-button>Add product</app-button></a>
      </app-page-header>
      <section class="mb-3 flex flex-wrap gap-2">
        <input
          class="rounded-xl border border-border px-3 py-2 text-sm"
          placeholder="Search title"
          [value]="query()"
          (input)="query.set(($any($event.target)).value)"
        />
        <button class="rounded-full border border-border px-3 py-1 text-xs" (click)="status.set('all')">All</button>
        <button class="rounded-full border border-border px-3 py-1 text-xs" (click)="status.set('published')">Published</button>
        <button class="rounded-full border border-border px-3 py-1 text-xs" (click)="status.set('draft')">Draft</button>
      </section>

      @if (loading()) {
        <app-loading-spinner />
      } @else if (filteredRaw().length === 0) {
        <app-empty-state title="No products yet" description="Create your first listing to start selling." />
      } @else {
        <section class="space-y-3">
          @for (item of filteredRaw(); track item.id) {
            <article class="rounded-2xl border border-border bg-surface p-3">
              <div class="grid gap-3 md:grid-cols-[1fr_auto]">
                <app-product-card [product]="toCard(item)" />
                <div class="flex flex-wrap items-start gap-2">
                  <a [routerLink]="['/products', item.id, 'edit']" class="rounded-lg border border-border px-3 py-2 text-xs">Edit</a>
                  <button class="rounded-lg border border-border px-3 py-2 text-xs" (click)="togglePublish(item)">
                    {{ item.published ? 'Unpublish' : 'Publish' }}
                  </button>
                  <button class="rounded-lg border border-border px-3 py-2 text-xs text-red-600" (click)="remove(item.id)">Delete</button>
                </div>
              </div>
            </article>
          }
        </section>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProductsPageComponent {
  private readonly productApi = inject(ProductApiService);
  readonly query = signal('');
  readonly status = signal<'all' | 'published' | 'draft'>('all');
  readonly loading = signal(false);
  readonly products = signal<ProductCardModel[]>([]);
  readonly productsRaw = signal<ProductApi[]>([]);

  constructor() {
    this.refresh();
  }

  filtered(): ProductCardModel[] {
    const q = this.query().trim().toLowerCase();
    return this.products().filter((item) => item.title.toLowerCase().includes(q));
  }

  filteredRaw(): ProductApi[] {
    const q = this.query().trim().toLowerCase();
    const byText = this.productsRaw().filter((item) => item.title.toLowerCase().includes(q));
    if (this.status() === 'all') {
      return byText;
    }
    return byText.filter((item) => (this.status() === 'published' ? item.published : !item.published));
  }

  refresh(): void {
    this.loading.set(true);
    this.productApi
      .myProducts()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (products) => {
          this.productsRaw.set(products);
          this.products.set(products.map(toProductCard));
        },
      });
  }

  toCard(item: ProductApi): ProductCardModel {
    return toProductCard(item);
  }

  togglePublish(item: ProductApi): void {
    const req$ = item.published ? this.productApi.unpublish(item.id) : this.productApi.publish(item.id);
    req$.subscribe({ next: () => this.refresh() });
  }

  remove(id: number): void {
    this.productApi.delete(id).subscribe({ next: () => this.refresh() });
  }
}
