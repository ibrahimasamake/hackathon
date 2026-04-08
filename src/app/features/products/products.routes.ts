import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/my-products-page.component').then((m) => m.MyProductsPageComponent),
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/create-product-page.component').then((m) => m.CreateProductPageComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/edit-product-page.component').then((m) => m.EditProductPageComponent),
  },
];
