import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, AlertService } from '../_services';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  standalone: false
})
export class VerifyEmailComponent implements OnInit {
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];

    if (!token) {
      this.loading = false;
      this.alertService.error('Verification token is missing.', {
        keepAfterRouteChange: true
      });
      this.router.navigate(['/account/login']);
      return;
    }

    this.accountService.verifyEmail(token).subscribe({
      next: () => {
        this.loading = false;

        this.alertService.success('Email verified successfully. You can now log in.', {
          keepAfterRouteChange: true
        });

        const lastUrl = localStorage.getItem('lastUrlBeforeVerify');

        if (lastUrl) {
          localStorage.removeItem('lastUrlBeforeVerify');
          this.router.navigateByUrl(lastUrl);
        } else {
          this.router.navigate(['/account/login']);
        }
      },
      error: (error) => {
        this.loading = false;

        this.alertService.error(error?.error?.message || 'Invalid or expired verification token.', {
          keepAfterRouteChange: true
        });

        this.router.navigate(['/account/login']);
      }
    });
  }
}