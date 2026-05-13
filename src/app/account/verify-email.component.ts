import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService, AlertService } from '../_services';

@Component({
  templateUrl: './verify-email.component.html',
  standalone: false
})
export class VerifyEmailComponent implements OnInit {
  verifying = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];

    if (!token) {
      this.alertService.error('Invalid verification link.', { keepAfterRouteChange: true });
      this.router.navigate(['/account/login']);
      return;
    }

    this.verifying = true;

    this.accountService.verifyEmail(token)
      .subscribe({
        next: () => {
          this.alertService.success(
            'Email verified successfully. You may now log in.',
            { keepAfterRouteChange: true }
          );

          this.router.navigate(['/account/login']);
        },
        error: error => {
          this.alertService.error(
            error?.error?.message || error || 'Email verification failed.',
            { keepAfterRouteChange: true }
          );

          this.router.navigate(['/account/login']);
        }
      });
  }
}