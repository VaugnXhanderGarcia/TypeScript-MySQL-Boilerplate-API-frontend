import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AccountService } from './_services';
import { Account } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  account?: Account | null;

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {
    this.accountService.account.subscribe(x => this.account = x);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;

        if (!url.includes('/account/verify-email')) {
          localStorage.setItem('lastUrlBeforeVerify', url);
        }
      });
  }

  logout() {
    this.accountService.logout();
  }
}