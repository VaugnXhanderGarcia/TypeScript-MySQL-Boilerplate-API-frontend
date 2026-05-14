import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService } from '../_services';
import { AlertService } from '../_services';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  standalone: false
})
export class VerifyEmailComponent implements OnInit {
  verifying = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    localStorage.removeItem('account');

    const token = this.route.snapshot.queryParams['token'];

    if (!token) {
      this.alertService.error('Verification token is missing.', {
        keepAfterRouteChange: true
      });

      this.router.navigate(['/account/login']);
      return;
    }

    this.accountService.verifyEmail(token).subscribe({
      next: () => {
        this.verifying = false;

        this.alertService.success('Email verified successfully. You can now log in.', {
          keepAfterRouteChange: true
        });

        this.router.navigate(['/account/login']);
      },
      error: error => {
        this.verifying = false;

        this.alertService.error(error || 'Email verification failed.', {
          keepAfterRouteChange: true
        });

        this.router.navigate(['/account/login']);
      }
    });
  }
}