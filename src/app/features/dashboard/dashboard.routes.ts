import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/farmer-dashboard-page.component').then((m) => m.FarmerDashboardPageComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../farmer-profile/pages/profile-settings-page.component').then((m) => m.ProfileSettingsPageComponent),
  },
];
