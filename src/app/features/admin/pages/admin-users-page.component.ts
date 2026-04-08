import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AdminApiService, AdminUserRow } from '../../../core/services/admin-api.service';
import { AppLoadingSpinnerComponent } from '../../../shared/ui/loading/app-loading-spinner.component';
import { AppPageHeaderComponent } from '../../../shared/ui/page-header/app-page-header.component';

@Component({
  selector: 'app-admin-users-page',
  imports: [AppPageHeaderComponent, AppLoadingSpinnerComponent, DatePipe],
  template: `
    <main class="mx-auto max-w-6xl px-4 py-6">
      <app-page-header title="Users" subtitle="Farmer and buyer account management" />
      @if (loading()) {
        <app-loading-spinner />
      } @else {
      <div class="overflow-hidden rounded-2xl border border-border bg-surface">
        <table class="w-full text-left text-sm">
          <thead class="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr><th class="px-4 py-3">Email</th><th class="px-4 py-3">Role</th><th class="px-4 py-3">Created</th></tr>
          </thead>
          <tbody>
            @for (user of users(); track user.id) {
              <tr class="border-t border-border">
                <td class="px-4 py-3">{{ user.email }}</td>
                <td class="px-4 py-3">{{ user.role }}</td>
                <td class="px-4 py-3">{{ user.createdAt | date:'mediumDate' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersPageComponent {
  private readonly adminApi = inject(AdminApiService);
  readonly loading = signal(true);
  readonly users = signal<AdminUserRow[]>([]);

  constructor() {
    this.adminApi.users(0, 50).subscribe({
      next: (page) => {
        this.users.set(page.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
