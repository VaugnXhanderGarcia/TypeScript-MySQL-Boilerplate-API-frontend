import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService, AlertService } from '../_services';

@Component({
  standalone: false,
  templateUrl: './verify-email.component.html'
})
export class VerifyEmailComponent implements OnInit {
  tokenStatus = 'validating';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];

    if (!token) {
      this.tokenStatus = 'invalid';
      this.alertService.error('Verification token is missing.');
      return;
    }

    this.accountService.verifyEmail(token).subscribe({
      next: () => {
        this.tokenStatus = 'verified';
        this.alertService.success('Email verified successfully. You can now log in.', {
          keepAfterRouteChange: true
        });

        setTimeout(() => {
          this.router.navigate(['/account/login']);
        }, 1500);
      },
      error: error => {
        this.tokenStatus = 'invalid';
        this.alertService.error(error || 'Email verification failed.');
      }
    });
  }
}