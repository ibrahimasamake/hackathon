import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" (click)="closed.emit()">
        <section class="w-full max-w-md rounded-2xl bg-surface p-5" (click)="$event.stopPropagation()">
          <ng-content />
        </section>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppModalComponent {
  readonly open = input(false);
  readonly closed = output<void>();
}
