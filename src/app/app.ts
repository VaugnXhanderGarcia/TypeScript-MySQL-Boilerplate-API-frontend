import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from './_services';
import { Account, Role } from './_models';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  Role = Role;
  account?: Account | null;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  logout() {
    this.accountService.logout();
  }

  openAccounts() {
    if (this.account?.role === Role.Admin) {
      this.router.navigate(['/admin/accounts']);
      return;
    }

    alert('Admin access only');
  }
}