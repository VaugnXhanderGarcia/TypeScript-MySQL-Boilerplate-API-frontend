import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  templateUrl: './verify-email.component.html'
})
export class VerifyEmailComponent implements OnInit {
  loading = false;
  verified = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];

    if (!token) {
      this.error = 'Verification token is missing.';
      return;
    }

    this.loading = true;

    this.accountService.verifyEmail(token).subscribe({
      next: () => {
        this.loading = false;
        this.verified = true;

        setTimeout(() => {
          this.router.navigate(['/account/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Verification failed.';
      }
    });
  }
}