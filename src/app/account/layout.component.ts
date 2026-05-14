import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AccountService } from '../_services';

@Component({
  selector: 'app-account-layout',
  templateUrl: './layout.component.html',
  standalone: false
})
export class LayoutComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    const currentUrl = this.router.url;

    const allowedPublicPages = [
      '/account/verify-email',
      '/account/reset-password',
      '/account/forgot-password',
      '/account/register'
    ];

    const isAllowedPublicPage = allowedPublicPages.some(page =>
      currentUrl.startsWith(page)
    );

    if (this.accountService.accountValue && !isAllowedPublicPage) {
      this.router.navigate(['/']);
    }
  }
}