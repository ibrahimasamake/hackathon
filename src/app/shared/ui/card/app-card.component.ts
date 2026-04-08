import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `<article class="rounded-2xl border border-border bg-surface p-4 shadow-sm"><ng-content /></article>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppCardComponent {}
