import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStoreService } from '../services/auth-store.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(AuthStoreService);
  const router = inject(Router);
  const roles = (route.data['roles'] as string[] | undefined) ?? [];
  const role = store.role();
  if (role && roles.includes(role)) {
    return true;
  }
  return router.createUrlTree(['/']);
};
