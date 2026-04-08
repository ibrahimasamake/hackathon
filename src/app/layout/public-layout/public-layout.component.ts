import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from '../../shared/ui/app-header/app-header.component';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, AppHeaderComponent],
  template: `
    <div class="min-h-screen bg-background text-foreground">
      <app-header mode="public" />

      <main class="pt-[68px] pb-[70px] md:pb-0">
        <router-outlet />
      </main>

      <footer class="border-t border-border bg-surface">
        <div class="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-muted-foreground md:grid-cols-4">
          <div>
            <p class="font-semibold text-foreground">Krishi Voice Market</p>
            <p class="mt-2">Voice-first multilingual commerce for Indian farmers and buyers.</p>
          </div>
          <div>
            <p class="font-semibold text-foreground">Marketplace</p>
            <div class="mt-2 space-y-1">
              <a routerLink="/marketplace" class="block">Browse products</a>
              <a routerLink="/ai-market-assistant" class="block">AI search</a>
              <a routerLink="/auth/register" class="block">Sell as farmer</a>
            </div>
          </div>
          <div>
            <p class="font-semibold text-foreground">For Farmers</p>
            <div class="mt-2 space-y-1">
              <a routerLink="/products/new" class="block">Create product</a>
              <a routerLink="/orders" class="block">Manage requests</a>
              <a routerLink="/app/dashboard" class="block">Dashboard</a>
            </div>
          </div>
          <div>
            <p class="font-semibold text-foreground">Help</p>
            <div class="mt-2 space-y-1">
              <a routerLink="/" class="block">How it works</a>
              <a routerLink="/auth/login" class="block">Login</a>
              <a routerLink="/ai-market-assistant" class="block text-primary">Try AI assistant</a>
            </div>
          </div>
        </div>
      </footer>

      <nav class="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 p-2 backdrop-blur md:hidden">
        <div class="grid grid-cols-5 gap-1 text-center text-xs">
          <a routerLink="/" class="rounded-lg py-2">Home</a>
          <a routerLink="/marketplace" class="rounded-lg py-2">Search</a>
          <a routerLink="/ai-market-assistant" class="rounded-lg bg-primary py-2 text-white">Voice</a>
          <a routerLink="/orders" class="rounded-lg py-2">Orders</a>
          <a routerLink="/app/profile" class="rounded-lg py-2">Profile</a>
        </div>
      </nav>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent {}
