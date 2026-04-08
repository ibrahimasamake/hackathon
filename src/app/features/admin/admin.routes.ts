import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/admin-dashboard-page.component').then((m) => m.AdminDashboardPageComponent),
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/admin-users-page.component').then((m) => m.AdminUsersPageComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/admin-products-moderation-page.component').then((m) => m.AdminProductsModerationPageComponent),
  },
];
