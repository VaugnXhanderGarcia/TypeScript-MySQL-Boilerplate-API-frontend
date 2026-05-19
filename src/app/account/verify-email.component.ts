import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, finalize } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services';

@Component({
  selector: 'app-verify-email',
  standalone: false,
  templateUrl: './verify-email.component.html'
})
export class VerifyEmailComponent implements OnInit {
  verifying = true;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.verifying = false;
      this.errorMessage = 'Verification token is missing. Redirecting to login...';

      setTimeout(() => {
        this.router.navigate(['/account/login']);
      }, 2000);

      return;
    }

    this.accountService.verifyEmail(token)
      .pipe(
        first(),
        finalize(() => {
          this.verifying = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.successMessage =
            response?.message ||
            'Email verified successfully. Redirecting to login...';

          this.alertService.success(
            'Email verified successfully. You can now log in.',
            { keepAfterRouteChange: true }
          );

          setTimeout(() => {
            this.router.navigate(['/account/login']);
          }, 1500);
        },
        error: error => {
          this.errorMessage =
            error?.error?.message ||
            error?.message ||
            error ||
            'Email verification failed. Redirecting to login...';

          this.alertService.error(this.errorMessage, {
            keepAfterRouteChange: true
          });

          setTimeout(() => {
            this.router.navigate(['/account/login']);
          }, 2500);
        }
      });
  }
}