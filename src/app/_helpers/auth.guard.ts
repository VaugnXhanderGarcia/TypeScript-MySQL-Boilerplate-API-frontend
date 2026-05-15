import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { AccountService, AlertService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const account = this.accountService.accountValue;

    if (account) {
      return true;
    }

    this.router.navigate(['/account/login'], {
      queryParams: { returnUrl: state.url }
    });

    return false;
  }
}

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
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

    if (account.role === 'Admin') {
      return true;
    }

    this.alertService.error('Admin access only. You are not allowed to open the Accounts section.', {
      autoClose: true,
      keepAfterRouteChange: false
    });

    this.router.navigate(['/']);
    return false;
  }
}