import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { AppButtonComponent } from '../../../shared/ui/button/app-button.component';
import { AppInputComponent } from '../../../shared/ui/input/app-input.component';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink, AppInputComponent, AppButtonComponent],
  template: `
    <main class="mx-auto min-h-screen max-w-md px-4 py-10">
      <section class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h1 class="text-xl font-semibold">Welcome back</h1>
        <p class="mt-1 text-sm text-muted-foreground">Log in to manage your farm listings.</p>

        <form class="mt-6 space-y-4" [formGroup]="form" (ngSubmit)="submit()">
          <app-input label="Email" placeholder="you@example.com" [control]="form.controls.email" />
          <app-input label="Password" type="password" [control]="form.controls.password" />
          <app-button type="submit">{{ loading() ? 'Signing in...' : 'Sign in' }}</app-button>
        </form>

        <p class="mt-4 text-sm text-muted-foreground">
          No account?
          <a class="text-primary" routerLink="/auth/register">Register</a>
        </p>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly authApi = inject(AuthApiService);
  private readonly store = inject(AuthStoreService);
  private readonly router = inject(Router);
  readonly loading = signal(false);

  readonly form = new FormGroup<LoginForm>({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.authApi
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (session) => {
          this.store.setSession(session);
          void this.router.navigateByUrl('/app/dashboard');
        },
      });
  }
}
