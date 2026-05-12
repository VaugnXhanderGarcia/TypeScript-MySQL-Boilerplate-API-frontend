import { Component } from '@angular/core';

import { Account } from './_models';
import { AccountService } from './_services';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html'
})
export class App {
  account?: Account | null;

  constructor(private accountService: AccountService) {
    this.accountService.account.subscribe(x => {
      this.account = x;
    });

    this.accountService.refreshToken().subscribe({
      next: () => {},
      error: () => {}
    });
  }

  logout() {
    this.accountService.logout();
  }
}