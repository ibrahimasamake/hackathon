import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppBadgeComponent } from '../badge/app-badge.component';
import { ProductCardModel } from '../../types/marketplace.types';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, AppBadgeComponent],
  template: `
    <article class="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <img [src]="product().imageUrl" [alt]="product().title" class="h-40 w-full object-cover" />
      <div class="space-y-2 p-3">
        <div class="flex items-start justify-between gap-2">
          <h3 class="line-clamp-2 text-sm font-semibold">{{ product().title }}</h3>
          <app-badge [tone]="product().freshnessLabel === 'Aging' ? 'warning' : 'success'">
            {{ product().freshnessLabel }}
          </app-badge>
        </div>
        <p class="text-xs text-muted-foreground">{{ product().farmerName }} • {{ product().location }}</p>
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold">
            {{ product().currency }} {{ product().price }} / {{ product().unit }}
          </p>
          <a [routerLink]="['/marketplace', product().id]" class="text-xs font-medium text-primary">View</a>
        </div>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppProductCardComponent {
  readonly product = input.required<ProductCardModel>();
}
