import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { FarmerApiService } from '../../../core/services/farmer-api.service';
import { AppButtonComponent } from '../../../shared/ui/button/app-button.component';
import { AppInputComponent } from '../../../shared/ui/input/app-input.component';
import { AppLoadingSpinnerComponent } from '../../../shared/ui/loading/app-loading-spinner.component';
import { AppPageHeaderComponent } from '../../../shared/ui/page-header/app-page-header.component';
import { AppSelectComponent } from '../../../shared/ui/select/app-select.component';
import { AppTextareaComponent } from '../../../shared/ui/textarea/app-textarea.component';

@Component({
  selector: 'app-profile-settings-page',
  imports: [
    ReactiveFormsModule,
    AppPageHeaderComponent,
    AppButtonComponent,
    AppInputComponent,
    AppSelectComponent,
    AppTextareaComponent,
    AppLoadingSpinnerComponent,
  ],
  template: `
    <main class="mx-auto max-w-3xl px-4 py-6">
      <app-page-header title="Profile settings" subtitle="Farmer profile and farm details" />
      <form class="space-y-4 rounded-2xl border border-border bg-surface p-5" [formGroup]="form" (ngSubmit)="save()">
        <app-input label="Full name" [control]="form.controls.fullName" />
        <app-input label="Farm name" [control]="form.controls.farmName" />
        <app-input label="Phone" [control]="form.controls.phone" />
        <app-input label="Town" [control]="form.controls.town" />
        <app-input label="Region" [control]="form.controls.region" />
        <app-textarea label="Bio" [control]="form.controls.bio" />
        <app-input label="Avatar URL" [control]="form.controls.avatarUrl" />
        <app-select
          label="Preferred language"
          [control]="form.controls.language"
          [options]="[
            { value: 'en', label: 'English' },
            { value: 'hi', label: 'Hindi' },
            { value: 'ta', label: 'Tamil' },
            { value: 'te', label: 'Telugu' },
            { value: 'kn', label: 'Kannada' },
            { value: 'ml', label: 'Malayalam' },
            { value: 'bn', label: 'Bengali' },
            { value: 'mr', label: 'Marathi' }
          ]"
        />
        <app-button type="submit">Save profile</app-button>
        @if (loading()) {
          <app-loading-spinner />
        }
        @if (saved()) {
          <p class="text-sm text-green-700">Profile saved.</p>
        }
      </form>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsPageComponent {
  private readonly farmerApi = inject(FarmerApiService);
  readonly loading = signal(false);
  readonly saved = signal(false);

  readonly form = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    farmName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    town: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    region: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    bio: new FormControl('', { nonNullable: true }),
    avatarUrl: new FormControl('', { nonNullable: true }),
    language: new FormControl('en', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    this.loading.set(true);
    this.farmerApi.getMyProfile().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (profile) =>
        this.form.patchValue({
          fullName: profile.fullName,
          farmName: profile.farmName,
          phone: profile.phone,
          town: profile.town,
          region: profile.region,
          bio: profile.bio ?? '',
          avatarUrl: profile.avatarUrl ?? '',
        }),
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.loading.set(true);
    this.saved.set(false);
    this.farmerApi
      .updateMyProfile({
        fullName: value.fullName,
        farmName: value.farmName,
        phone: value.phone,
        town: value.town,
        region: value.region,
        bio: value.bio || '',
        avatarUrl: value.avatarUrl || null,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.saved.set(true),
      });
  }
}
