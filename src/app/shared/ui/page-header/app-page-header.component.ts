import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <header class="mb-4 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="text-sm text-muted-foreground">{{ subtitle() }}</p>
        }
      </div>
      <ng-content />
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppPageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
