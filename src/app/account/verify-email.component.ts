import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services';

enum EmailStatus {
  Verifying,
  Failed
}

@Component({
  standalone: false,
  templateUrl: './verify-email.component.html'
})
export class VerifyEmailComponent implements OnInit {
  EmailStatus = EmailStatus;
  emailStatus = EmailStatus.Verifying;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
  const token = this.route.snapshot.queryParams['token'];

  if (!token) {
    this.alertService.error('Invalid verification link');
    this.router.navigate(['../login'], { relativeTo: this.route });
    return;
  }

  this.accountService.verifyEmail(token)
    .subscribe({
      next: () => {
        this.alertService.success('Verification successful. You can now login.', {
          keepAfterRouteChange: true
        });
        this.router.navigate(['../login'], { relativeTo: this.route });
      },
      error: error => {
        this.alertService.error(error);
        this.router.navigate(['../login'], { relativeTo: this.route });
      }
    });
}
}