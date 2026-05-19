import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AccountService } from '../_services';

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
    private accountService: AccountService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.verifying = false;
      this.errorMessage = 'Verification token is missing.';
      return;
    }

    this.accountService.verifyEmail(token)
      .subscribe({
        next: (response: any) => {
          this.verifying = false;
          this.successMessage =
            response?.message ||
            'Email verified successfully. You can now log in.';
        },
        error: error => {
          this.verifying = false;
          this.errorMessage =
            error?.error?.message ||
            error?.message ||
            error ||
            'Email verification failed.';
        }
      });
  }
}