import { Component } from '@angular/core';
import { AccountService } from './_services';
import { Account } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  account?: Account | null;

  constructor(private accountService: AccountService) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  logout(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    this.accountService.logout();
  }
}