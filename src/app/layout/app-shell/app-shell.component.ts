import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-app-shell',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-background">
      <header class="border-b border-border bg-surface">
        <nav class="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 text-sm">
          <a routerLink="/" class="font-semibold text-primary">Farmers Platform</a>
          <a routerLink="/marketplace">Marketplace</a>
          <a routerLink="/app/dashboard">Dashboard</a>
          <a routerLink="/products">Products</a>
          <a routerLink="/orders">Orders</a>
        </nav>
      </header>
      <router-outlet />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {}
