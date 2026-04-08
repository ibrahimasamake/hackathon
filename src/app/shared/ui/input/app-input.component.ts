import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  template: `
    <label class="block space-y-1">
      <span class="text-xs font-medium text-muted-foreground">{{ label() }}</span>
      <input
        class="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs outline-hidden focus:border-primary"
        [type]="type()"
        [placeholder]="placeholder()"
        [formControl]="control()"
      />
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppInputComponent {
  readonly label = input.required<string>();
  readonly placeholder = input<string>('');
  readonly type = input<string>('text');
  readonly control = input.required<FormControl<string>>();
}
