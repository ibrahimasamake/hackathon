import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <span class="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-primary"></span>
      <span>Loading...</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLoadingSpinnerComponent {}
