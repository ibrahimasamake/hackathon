import { Routes } from '@angular/router';

export const MARKETPLACE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing-page.component').then((m) => m.LandingPageComponent),
  },
  {
    path: 'marketplace',
    loadComponent: () => import('./pages/marketplace-page.component').then((m) => m.MarketplacePageComponent),
  },
  {
    path: 'marketplace/:id',
    loadComponent: () =>
      import('./pages/product-detail-page.component').then((m) => m.ProductDetailPageComponent),
  },
  {
    path: 'categories/:slug',
    loadComponent: () => import('./pages/category-page.component').then((m) => m.CategoryPageComponent),
  },
  {
    path: 'farmers/:id',
    loadComponent: () =>
      import('./pages/farmer-public-profile-page.component').then((m) => m.FarmerPublicProfilePageComponent),
  },
];
