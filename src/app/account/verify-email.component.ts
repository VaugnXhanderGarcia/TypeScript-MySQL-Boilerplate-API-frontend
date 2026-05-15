import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, AlertService } from '../_services';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  standalone: false
})
export class VerifyEmailComponent implements OnInit {
  verifying = true;
  verified = false;
  failed = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];

    if (!token) {
      this.verifying = false;
      this.failed = true;
      this.alertService.error('Verification token is missing.');
      return;
    }

    this.accountService.verifyEmail(token).subscribe({
      next: () => {
        this.verifying = false;
        this.verified = true;

        this.alertService.success('Email verified successfully. You can now log in.');

        setTimeout(() => {
          this.router.navigate(['/account/login']);
        }, 2000);
      },
      error: (error) => {
        this.verifying = false;
        this.failed = true;

        const message =
          error?.error?.message ||
          error?.message ||
          'Email verification failed. The token may be invalid or expired.';

        this.alertService.error(message);
      }
    });
  }
}