import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AccountService } from '../_services';
import { AlertService } from '../_services/alert.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
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