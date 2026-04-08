import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  imports: [ReactiveFormsModule],
  template: `
    <label class="block space-y-1">
      <span class="text-xs font-medium text-muted-foreground">{{ label() }}</span>
      <textarea class="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs" [rows]="rows()" [formControl]="control()"></textarea>
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTextareaComponent {
  readonly label = input.required<string>();
  readonly rows = input<number>(4);
  readonly control = input.required<FormControl<string>>();
}
