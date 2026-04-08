import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select',
  imports: [ReactiveFormsModule],
  template: `
    <label class="block space-y-1">
      <span class="text-xs font-medium text-muted-foreground">{{ label() }}</span>
      <select class="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs" [formControl]="control()">
        @for (option of options(); track option.value) {
          <option [value]="option.value">{{ option.label }}</option>
        }
      </select>
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSelectComponent {
  readonly label = input.required<string>();
  readonly options = input<SelectOption[]>([]);
  readonly control = input.required<FormControl<string>>();
}
