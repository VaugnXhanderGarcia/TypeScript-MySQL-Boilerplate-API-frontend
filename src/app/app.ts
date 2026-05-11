import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService, AlertService } from './_services';
import { Account } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false
})
export class App {
  account?: Account | null;

  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  openAccounts() {
    if (this.account?.role === 'Admin') {
      this.router.navigate(['/admin/accounts']);
      return;
    }

    this.alertService.error('Admin access only.');
  }

  logout() {
    this.accountService.logout();
  }
}