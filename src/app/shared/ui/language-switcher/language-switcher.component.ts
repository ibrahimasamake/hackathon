import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppLanguage, I18nService } from '../../../core/i18n/i18n.service';

@Component({
  selector: 'app-language-switcher',
  imports: [FormsModule],
  template: `
    <label class="inline-flex items-center gap-2 text-xs">
      <span class="text-muted-foreground">Lang</span>
      <select
        class="rounded-lg border border-border bg-surface px-2 py-1 text-xs"
        [ngModel]="i18n.language()"
        (ngModelChange)="change($event)"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="ta">தமிழ்</option>
        <option value="te">తెలుగు</option>
        <option value="kn">ಕನ್ನಡ</option>
        <option value="ml">മലയാളം</option>
        <option value="bn">বাংলা</option>
        <option value="mr">मराठी</option>
      </select>
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  readonly i18n = inject(I18nService);

  change(language: AppLanguage): void {
    this.i18n.setLanguage(language);
  }
}
