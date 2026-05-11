import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { AccountService, AlertService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const account = this.accountService.accountValue;

    if (!account) {
      this.router.navigate(['/account/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    const roles = route.data['roles'] as string[] | undefined;

    if (roles && roles.length && !roles.includes(account.role)) {
      this.alertService.error('Admin access only.');
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}