import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppButtonComponent } from '../button/app-button.component';
import { AppModalComponent } from '../modal/app-modal.component';

@Component({
  selector: 'app-confirm-dialog',
  imports: [AppModalComponent, AppButtonComponent],
  template: `
    <app-modal [open]="open()" (closed)="cancel.emit()">
      <h3 class="text-lg font-semibold">{{ title() }}</h3>
      <p class="mt-2 text-sm text-muted-foreground">{{ message() }}</p>
      <div class="mt-4 flex justify-end gap-2">
        <app-button variant="outline" (click)="cancel.emit()">Cancel</app-button>
        <app-button (click)="confirmed.emit()">Confirm</app-button>
      </div>
    </app-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppConfirmDialogComponent {
  readonly open = input(false);
  readonly title = input('Confirm action');
  readonly message = input('Are you sure?');
  readonly cancel = output<void>();
  readonly confirmed = output<void>();
}
