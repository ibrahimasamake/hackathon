import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  template: `
    <span class="rounded-full px-2.5 py-1 text-xs font-medium"
      [class.bg-green-100]="tone() === 'success'"
      [class.text-green-800]="tone() === 'success'"
      [class.bg-amber-100]="tone() === 'warning'"
      [class.text-amber-900]="tone() === 'warning'"
      [class.bg-red-100]="tone() === 'danger'"
      [class.text-red-700]="tone() === 'danger'"
      [class.bg-muted]="tone() === 'neutral'"
      [class.text-foreground]="tone() === 'neutral'"
    ><ng-content /></span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBadgeComponent {
  readonly tone = input<'success' | 'warning' | 'danger' | 'neutral'>('neutral');
}
