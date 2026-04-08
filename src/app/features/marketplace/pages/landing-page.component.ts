import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ProductApiService } from '../../../core/services/product-api.service';
import { toProductCard } from '../../../core/utils/product-mappers';
import { RouterLink } from '@angular/router';
import { AppButtonComponent } from '../../../shared/ui/button/app-button.component';
import { AppFarmerCardComponent } from '../../../shared/ui/farmer-card/app-farmer-card.component';
import { AppProductCardComponent } from '../../../shared/ui/product-card/app-product-card.component';
import { FarmerCardModel, ProductCardModel } from '../../../shared/types/marketplace.types';
import { I18nService } from '../../../core/i18n/i18n.service';
import { AppLoadingSpinnerComponent } from '../../../shared/ui/loading/app-loading-spinner.component';

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink, AppButtonComponent, AppProductCardComponent, AppFarmerCardComponent, AppLoadingSpinnerComponent],
  template: `
    <main>
      <section class="relative overflow-hidden bg-gradient-to-br from-[#e8f4e7] via-background to-[#fff8eb]">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <p class="text-sm font-medium text-primary">Krishi Voice Market</p>
            <h1 class="mt-3 text-4xl font-bold leading-tight md:text-5xl">
              {{ i18n.t('heroTitle') }}
            </h1>
            <p class="mt-4 max-w-2xl text-base text-muted-foreground">
              {{ i18n.t('heroSub') }}
            </p>
            <div class="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-surface p-2 shadow-sm">
              <input class="w-full border-none bg-transparent px-2 text-sm focus:ring-0" placeholder="Search tomatoes, onions, rice..." />
              <a routerLink="/marketplace"><app-button>Search</app-button></a>
              <a routerLink="/ai-market-assistant"><app-button variant="outline">🎙</app-button></a>
            </div>
            <div class="mt-8 flex flex-wrap gap-3">
              <a routerLink="/marketplace"><app-button>{{ i18n.t('startBuying') }}</app-button></a>
              <a routerLink="/auth/register"><app-button variant="outline">{{ i18n.t('startSelling') }}</app-button></a>
              <a routerLink="/ai-market-assistant"><app-button variant="outline">🎙 Voice AI</app-button></a>
            </div>
            <div class="mt-5 flex flex-wrap gap-2 text-xs">
              @for (cat of quickCategories; track cat) {
                <a routerLink="/marketplace" class="rounded-full border border-border bg-surface px-3 py-1.5">{{ cat }}</a>
              }
            </div>
          </div>
          <article class="rounded-3xl border border-border bg-surface p-4 shadow-sm">
            <p class="text-sm font-semibold">AI Voice Search</p>
            <p class="mt-1 text-sm text-muted-foreground">Try: “Mujhe saste tamatar chahiye”</p>
            <div class="mt-4 space-y-3">
              <div class="rounded-xl bg-muted p-3 text-sm">Detected: Hindi • Intent: tomato + cheap + nearby</div>
              <div class="rounded-xl border border-border p-3 text-sm">Showing 12 products near Whitefield</div>
              <div class="rounded-xl border border-border p-3 text-sm">Also showing cheaper onion alternatives</div>
            </div>
          </article>
        </div>
      </section>

      <section class="border-y border-border bg-surface">
        <div class="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-4 md:grid-cols-5">
          <div class="rounded-xl bg-background p-3 text-center text-xs font-semibold">10K+ Local Farmers</div>
          <div class="rounded-xl bg-background p-3 text-center text-xs font-semibold">Verified Sellers</div>
          <div class="rounded-xl bg-background p-3 text-center text-xs font-semibold">Fresh Harvest Daily</div>
          <div class="rounded-xl bg-background p-3 text-center text-xs font-semibold">8 Languages</div>
          <div class="rounded-xl bg-background p-3 text-center text-xs font-semibold">Fast Request Flow</div>
        </div>
      </section>

      <section id="categories" class="mx-auto max-w-7xl px-4 py-10">
        <div class="mb-4 flex items-end justify-between gap-2">
          <h2 class="text-2xl font-semibold">Featured categories</h2>
          <a routerLink="/marketplace" class="text-sm text-primary">Browse all</a>
        </div>
        <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          @for (category of categories; track category.name) {
            <a routerLink="/marketplace" class="rounded-2xl border border-border bg-surface p-4 transition hover:-translate-y-0.5">
              <p class="text-sm font-semibold">{{ category.name }}</p>
              <p class="mt-1 text-xs text-muted-foreground">{{ category.count }} products</p>
            </a>
          }
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 py-6">
        <div class="mb-4 flex items-end justify-between gap-2">
          <h2 class="text-2xl font-semibold">Featured products</h2>
          <a routerLink="/marketplace" class="text-sm text-primary">See more</a>
        </div>
        @if (loading()) {
          <div class="mt-4"><app-loading-spinner /></div>
        } @else {
        <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (item of featured(); track item.id) {
            <app-product-card [product]="item" />
          }
        </div>
        }
      </section>

      <section class="mx-auto max-w-7xl px-4 py-8">
        <div class="mb-4 flex items-end justify-between gap-2">
          <h2 class="text-2xl font-semibold">Nearby products</h2>
          <a routerLink="/marketplace" class="text-sm text-primary">Use location filter</a>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (item of featured().slice(0, 4); track item.id) {
            <app-product-card [product]="item" />
          }
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 py-8">
        <h2 class="text-2xl font-semibold">Top farmers</h2>
        <div class="mt-4 grid gap-3 md:grid-cols-3">
          @for (farmer of farmers; track farmer.id) {
            <app-farmer-card [farmer]="farmer" />
          }
        </div>
      </section>

      <section class="mx-auto max-w-7xl rounded-3xl border border-border bg-surface px-4 py-8">
        <h2 class="text-2xl font-semibold">Voice AI market assistant</h2>
        <p class="mt-2 max-w-2xl text-sm text-muted-foreground">
          Ask in English, Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, or Marathi and get product cards instantly.
        </p>
        <div class="mt-4 flex flex-wrap gap-2 text-xs">
          <span class="rounded-full border border-border px-3 py-1.5">मुझे सस्ते टमाटर दिखाओ</span>
          <span class="rounded-full border border-border px-3 py-1.5">எனக்கு அருகில் புதிய வெங்காயம் வேண்டும்</span>
          <span class="rounded-full border border-border px-3 py-1.5">Show fresh rice near me</span>
        </div>
        <div class="mt-4">
          <a routerLink="/ai-market-assistant"><app-button>Open AI assistant</app-button></a>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 py-10">
        <h2 class="text-2xl font-semibold">How it works</h2>
        <div class="mt-4 grid gap-3 md:grid-cols-3">
          <div class="rounded-2xl border border-border bg-surface p-4">1. Farmer uploads products</div>
          <div class="rounded-2xl border border-border bg-surface p-4">2. Buyer searches by voice/text</div>
          <div class="rounded-2xl border border-border bg-surface p-4">3. Order request is accepted directly</div>
        </div>
      </section>

      <section id="farmers" class="mx-auto max-w-7xl rounded-3xl bg-[#123220] px-4 py-10 text-white">
        <h2 class="text-2xl font-semibold">Sell directly from your farm</h2>
        <p class="mt-2 max-w-2xl text-sm text-white/80">
          Create listings, manage stock, receive buyer requests, and grow your income with a multilingual marketplace.
        </p>
        <div class="mt-5 flex flex-wrap gap-3">
          <a routerLink="/auth/register"><app-button>Join as Farmer</app-button></a>
          <a routerLink="/products/new"><app-button variant="outline">Create Product</app-button></a>
        </div>
      </section>

      <section id="help" class="mx-auto max-w-7xl px-4 py-10">
        <h2 class="text-2xl font-semibold">What people say</h2>
        <div class="mt-4 grid gap-3 md:grid-cols-3">
          <article class="rounded-2xl border border-border bg-surface p-4 text-sm">“I listed onions in 2 minutes and got requests same day.”</article>
          <article class="rounded-2xl border border-border bg-surface p-4 text-sm">“Voice search helped my family find fresh vegetables nearby.”</article>
          <article class="rounded-2xl border border-border bg-surface p-4 text-sm">“Farmer dashboard is clear and easy to use on mobile.”</article>
        </div>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  readonly i18n = inject(I18nService);
  private readonly productApi = inject(ProductApiService);
  readonly featured = signal<ProductCardModel[]>([]);
  readonly loading = signal(false);
  readonly quickCategories = ['Vegetables', 'Fruits', 'Rice', 'Pulses', 'Spices', 'Dairy'];
  readonly categories = [
    { name: 'Vegetables', count: 142 },
    { name: 'Fruits', count: 96 },
    { name: 'Grains', count: 88 },
    { name: 'Rice', count: 57 },
    { name: 'Pulses', count: 66 },
    { name: 'Spices', count: 44 },
    { name: 'Dairy', count: 39 },
    { name: 'Flowers', count: 24 },
    { name: 'Organic Produce', count: 73 },
    { name: 'Seeds', count: 30 },
  ];
  readonly farmers: FarmerCardModel[] = [
    { id: 1, farmName: 'Green Valley Farm', ownerName: 'Ravi Kumar', region: 'Karnataka', verified: true },
    { id: 2, farmName: 'Sunrise Agro', ownerName: 'Priya Iyer', region: 'Tamil Nadu', verified: true },
    { id: 3, farmName: 'Harvest Roots', ownerName: 'Amit Singh', region: 'Maharashtra', verified: false },
  ];

  constructor() {
    this.loading.set(true);
    this.productApi.featured().subscribe({
      next: (products) => {
        this.featured.set(products.map(toProductCard));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
