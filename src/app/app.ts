import { Component } from '@angular/core';

import { AccountService } from './_services';
import { Account } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false
})
export class App {
  account?: Account | null;

  constructor(private accountService: AccountService) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  get isAdmin(): boolean {
    return this.account?.role === 'Admin';
  }

  logout() {
    this.accountService.logout();
  }
}