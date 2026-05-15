import { Component } from '@angular/core';

import { Account } from './_models';
import { AccountService } from './_services';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html'
})
export class AppComponent {
  account: Account | null = null;

  constructor(private accountService: AccountService) {
    this.accountService.account.subscribe(x => {
      this.account = x;
    });
  }

  logout() {
    this.accountService.logout();
  }
}