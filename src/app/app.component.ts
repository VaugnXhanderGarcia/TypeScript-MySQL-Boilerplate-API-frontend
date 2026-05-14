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
  account: Account | null = null;
  showNavbar = true;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {
    this.accountService.account.subscribe(x => this.account = x);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showNavbar = !event.url.includes('/account/');
      });
  }

  logout() {
    this.accountService.logout();
  }
}