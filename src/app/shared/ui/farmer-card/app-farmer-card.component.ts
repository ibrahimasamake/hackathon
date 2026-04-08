import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FarmerCardModel } from '../../types/marketplace.types';
import { AppBadgeComponent } from '../badge/app-badge.component';

@Component({
  selector: 'app-farmer-card',
  imports: [AppBadgeComponent],
  template: `
    <article class="rounded-2xl border border-border bg-surface p-4">
      <div class="mb-2 flex items-center justify-between">
        <h3 class="text-sm font-semibold">{{ farmer().farmName }}</h3>
        @if (farmer().verified) {
          <app-badge tone="success">Verified</app-badge>
        }
      </div>
      <p class="text-sm text-muted-foreground">{{ farmer().ownerName }}</p>
      <p class="text-xs text-muted-foreground">{{ farmer().region }}</p>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFarmerCardComponent {
  readonly farmer = input.required<FarmerCardModel>();
}
