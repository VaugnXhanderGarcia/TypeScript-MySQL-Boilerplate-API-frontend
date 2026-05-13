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
    private accountService: AccountService
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
    const role = account?.role?.toString().trim().toLowerCase();

    if (role === 'admin') {
      return true;
    }

    this.alertService.error('Admin access only', {
      keepAfterRouteChange: true
    });

    this.router.navigate(['/']);

    return false;
  }
}