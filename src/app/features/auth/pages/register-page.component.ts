import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { UserRole } from '../../../core/models/auth.model';
import { AppButtonComponent } from '../../../shared/ui/button/app-button.component';
import { AppInputComponent } from '../../../shared/ui/input/app-input.component';

interface RegisterForm {
  email: FormControl<string>;
  password: FormControl<string>;
  role: FormControl<UserRole>;
}

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink, AppInputComponent, AppButtonComponent],
  template: `
    <main class="mx-auto min-h-screen max-w-md px-4 py-10">
      <section class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h1 class="text-xl font-semibold">Create account</h1>
        <p class="mt-1 text-sm text-muted-foreground">Join as a farmer or buyer.</p>

        <form class="mt-6 space-y-4" [formGroup]="form" (ngSubmit)="submit()">
          <app-input label="Email" placeholder="you@example.com" [control]="form.controls.email" />
          <app-input label="Password" type="password" [control]="form.controls.password" />
          <label class="block space-y-1">
            <span class="text-xs font-medium text-muted-foreground">Role</span>
            <select class="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm" formControlName="role">
              <option value="ROLE_FARMER">Farmer</option>
              <option value="ROLE_BUYER">Buyer</option>
            </select>
          </label>
          <app-button type="submit">{{ loading() ? 'Creating...' : 'Create account' }}</app-button>
        </form>

        <p class="mt-4 text-sm text-muted-foreground">
          Already registered?
          <a class="text-primary" routerLink="/auth/login">Log in</a>
        </p>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  private readonly authApi = inject(AuthApiService);
  private readonly store = inject(AuthStoreService);
  private readonly router = inject(Router);
  readonly loading = signal(false);

  readonly form = new FormGroup<RegisterForm>({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    role: new FormControl<UserRole>('ROLE_FARMER', { nonNullable: true, validators: [Validators.required] }),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.authApi
      .register(this.form.getRawValue())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (session) => {
          this.store.setSession(session);
          void this.router.navigateByUrl('/app/dashboard');
        },
      });
  }
}
