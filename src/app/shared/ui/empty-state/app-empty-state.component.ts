import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <section class="rounded-2xl border border-dashed border-border bg-surface/70 p-6 text-center">
      <h3 class="text-base font-semibold">{{ title() }}</h3>
      <p class="mt-2 text-sm text-muted-foreground">{{ description() }}</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppEmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
