import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProductApiService } from '../../../core/services/product-api.service';
import { toProductCard } from '../../../core/utils/product-mappers';
import { ProductCardModel } from '../../../shared/types/marketplace.types';
import { AppProductCardComponent } from '../../../shared/ui/product-card/app-product-card.component';
import { AppPageHeaderComponent } from '../../../shared/ui/page-header/app-page-header.component';
import { AppLoadingSpinnerComponent } from '../../../shared/ui/loading/app-loading-spinner.component';
import { AppEmptyStateComponent } from '../../../shared/ui/empty-state/app-empty-state.component';

@Component({
  selector: 'app-marketplace-page',
  imports: [RouterLink, AppProductCardComponent, AppPageHeaderComponent, AppLoadingSpinnerComponent, AppEmptyStateComponent],
  template: `
    <main class="mx-auto max-w-7xl px-4 py-6">
      <nav class="mb-3 text-xs text-muted-foreground">
        <a routerLink="/">Home</a> / Marketplace
      </nav>
      <app-page-header title="Marketplace" subtitle="Discover fresh local products">
        <div class="flex w-full items-center gap-2">
          <input
            class="w-full rounded-xl border border-border px-3 py-2 text-sm"
            placeholder="Search products, location, farmer..."
            [value]="query()"
            (input)="onQueryChange(($any($event.target)).value)"
          />
          <button class="rounded-xl border border-border px-3 py-2 text-sm" (click)="voicePrompt()">
            🎙 Voice
          </button>
        </div>
      </app-page-header>

      <section class="mb-4 rounded-2xl border border-border bg-surface p-3">
        <div class="flex flex-wrap items-center gap-2 text-xs">
          @for (category of categories; track category) {
            <button class="rounded-full border border-border px-3 py-1" (click)="setCategory(category)">{{ category }}</button>
          }
          <select class="rounded-lg border border-border px-2 py-1 text-xs" [value]="sort()" (change)="setSort(($any($event.target)).value)">
            <option value="newest">Newest</option>
            <option value="price_asc">Price low-high</option>
            <option value="price_desc">Price high-low</option>
            <option value="freshest">Freshest</option>
          </select>
          <button class="rounded-lg border border-border px-2 py-1 text-xs" (click)="viewMode.set(viewMode() === 'grid' ? 'list' : 'grid')">
            {{ viewMode() === 'grid' ? 'List view' : 'Grid view' }}
          </button>
          <button class="rounded-lg border border-border px-2 py-1 text-xs" (click)="clearFilters()">Clear filters</button>
          <span class="ml-auto text-muted-foreground">{{ totalResults() }} results</span>
        </div>
        <div class="mt-3 flex flex-wrap gap-2 text-xs">
          @for (chip of activeFilterChips(); track chip) {
            <span class="rounded-full bg-muted px-3 py-1">{{ chip }}</span>
          }
        </div>
      </section>

      <div class="grid gap-4 lg:grid-cols-[260px_1fr]">
        <aside class="hidden h-fit rounded-2xl border border-border bg-surface p-4 lg:block">
          <p class="text-sm font-semibold">Filters</p>
          <div class="mt-3 space-y-3 text-sm">
            <label class="block space-y-1">
              <span class="text-xs text-muted-foreground">Location</span>
              <input class="w-full rounded-lg border border-border px-3 py-2 text-sm" [value]="locationFilter()" (input)="setLocation(($any($event.target)).value)" />
            </label>
            <label class="block space-y-1">
              <span class="text-xs text-muted-foreground">Availability</span>
              <select class="w-full rounded-lg border border-border px-3 py-2 text-sm" [value]="availabilityFilter()" (change)="setAvailability(($any($event.target)).value)">
                <option value="">All</option>
                <option value="AVAILABLE">Available</option>
                <option value="UNAVAILABLE">Unavailable</option>
              </select>
            </label>
            <div>
              <p class="mb-2 text-xs text-muted-foreground">Trending searches</p>
              <div class="flex flex-wrap gap-2">
                @for (trend of trendingSearches; track trend) {
                  <button class="rounded-full border border-border px-2 py-1 text-xs" (click)="onQueryChange(trend)">{{ trend }}</button>
                }
              </div>
            </div>
          </div>
        </aside>

        <section>
          <div class="mb-4 rounded-2xl border border-border bg-surface p-3">
            <p class="text-xs text-muted-foreground">Recent searches</p>
            <div class="mt-2 flex flex-wrap gap-2">
              @for (recent of recentSearches(); track recent) {
                <button class="rounded-full border border-border px-2.5 py-1 text-xs" (click)="onQueryChange(recent)">{{ recent }}</button>
              }
            </div>
          </div>

          @if (loading()) {
            <app-loading-spinner />
          } @else if (error()) {
            <app-empty-state title="Failed to load products" [description]="error()!" />
          } @else if (sortedProducts().length === 0) {
            <app-empty-state title="No products found" description="Try a different keyword or filter." />
          } @else {
            <section [class]="viewMode() === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'grid gap-3'">
              @for (item of sortedProducts(); track item.id) {
                <app-product-card [product]="item" />
              }
            </section>
          }
        </section>
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketplacePageComponent {
  private readonly productApi = inject(ProductApiService);
  readonly query = signal('');
  readonly selectedCategory = signal('All');
  readonly locationFilter = signal('');
  readonly availabilityFilter = signal<'AVAILABLE' | 'UNAVAILABLE' | ''>('');
  readonly sort = signal<'newest' | 'price_asc' | 'price_desc' | 'freshest'>('newest');
  readonly viewMode = signal<'grid' | 'list'>('grid');
  readonly products = signal<ProductCardModel[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly totalResults = signal(0);
  readonly categories = ['All', 'Vegetables', 'Grains', 'Fruits', 'Rice', 'Pulses', 'Spices', 'Dairy'];
  readonly trendingSearches = ['fresh tomato', 'cheap onion', 'organic rice', 'potato near me', 'banana bulk'];
  readonly recentSearches = signal<string[]>(['tomato near whitefield', 'organic rice', 'fresh onion']);

  constructor() {
    this.loadProducts();
  }

  readonly filteredProducts = computed(() => {
    const query = this.query().trim().toLowerCase();
    if (!query) {
      return this.products().filter((item) => this.matchesLocation(item.location));
    }
    return this.products().filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.farmerName.toLowerCase().includes(query),
    ).filter((item) => this.matchesCategory(item.title)).filter((item) => this.matchesLocation(item.location));
  });

  readonly activeFilterChips = computed(() => {
    const chips: string[] = [];
    if (this.selectedCategory() !== 'All') {
      chips.push(this.selectedCategory());
    }
    if (this.locationFilter().trim()) {
      chips.push(`Location: ${this.locationFilter().trim()}`);
    }
    if (this.availabilityFilter()) {
      chips.push(`Availability: ${this.availabilityFilter()}`);
    }
    if (this.query().trim()) {
      chips.push(`Query: ${this.query().trim()}`);
    }
    return chips.length > 0 ? chips : ['No active filters'];
  });

  readonly sortedProducts = computed(() => {
    const items = [...this.filteredProducts()];
    switch (this.sort()) {
      case 'price_asc':
        return items.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return items.sort((a, b) => b.price - a.price);
      case 'freshest':
        return items.sort((a, b) => (a.freshnessLabel === 'Fresh' ? -1 : 1) - (b.freshnessLabel === 'Fresh' ? -1 : 1));
      default:
        return items;
    }
  });

  voicePrompt(): void {
    this.query.set('tomato near whitefield');
    this.loadProducts();
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    if (value.trim()) {
      this.recentSearches.update((current) => [value.trim(), ...current.filter((item) => item !== value.trim())].slice(0, 5));
    }
    this.loadProducts();
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
    this.loadProducts();
  }

  setLocation(location: string): void {
    this.locationFilter.set(location);
    this.loadProducts();
  }

  setAvailability(value: 'AVAILABLE' | 'UNAVAILABLE' | ''): void {
    this.availabilityFilter.set(value);
    this.loadProducts();
  }

  setSort(sort: 'newest' | 'price_asc' | 'price_desc' | 'freshest'): void {
    this.sort.set(sort);
    this.loadProducts();
  }

  clearFilters(): void {
    this.query.set('');
    this.selectedCategory.set('All');
    this.locationFilter.set('');
    this.availabilityFilter.set('');
    this.sort.set('newest');
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);
    this.productApi
      .searchPublic({
        q: this.query() || undefined,
        category: this.selectedCategory() === 'All' ? undefined : this.selectedCategory(),
        location: this.locationFilter() || undefined,
        availability: this.availabilityFilter() || undefined,
        sort: this.sort(),
        page: 0,
        size: 24,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (page) => {
          this.products.set(page.content.map(toProductCard));
          this.totalResults.set(page.totalElements);
        },
        error: () => this.error.set('Please check backend/API and try again.'),
      });
  }

  private matchesCategory(title: string): boolean {
    if (this.selectedCategory() === 'All') {
      return true;
    }
    const lower = title.toLowerCase();
    if (this.selectedCategory() === 'Vegetables') {
      return ['tomato', 'onion', 'potato'].some((item) => lower.includes(item));
    }
    if (this.selectedCategory() === 'Grains' || this.selectedCategory() === 'Rice') {
      return ['rice', 'maize', 'wheat'].some((item) => lower.includes(item));
    }
    if (this.selectedCategory() === 'Fruits') {
      return ['apple', 'banana', 'mango'].some((item) => lower.includes(item));
    }
    return true;
  }

  private matchesLocation(location: string): boolean {
    const filter = this.locationFilter().trim().toLowerCase();
    if (!filter) {
      return true;
    }
    return location.toLowerCase().includes(filter);
  }
}
