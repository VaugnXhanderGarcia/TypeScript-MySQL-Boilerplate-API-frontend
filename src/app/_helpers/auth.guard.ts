import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AccountService, AlertService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountService: AccountService
  ) {}

  canActivate() {
    const account = this.accountService.accountValue;

    if (account) {
      return true;
    }

    this.router.navigate(['/account/login']);
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

  canActivate() {
    const account = this.accountService.accountValue;

    if (account && account.role === 'Admin') {
      return true;
    }

    this.alertService.error('Admin access only.', {
      keepAfterRouteChange: true
    });

    this.router.navigate(['/']);
    return false;
  }
}