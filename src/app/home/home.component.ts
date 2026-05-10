import { Component } from '@angular/core';

import { AccountService } from '../_services';
import { Account } from '../_models';

@Component({
  templateUrl: './home.component.html',
  standalone: false
})
export class HomeComponent {
  account?: Account | null;

  constructor(private accountService: AccountService) {
    this.accountService.account.subscribe(x => this.account = x);
  }
}