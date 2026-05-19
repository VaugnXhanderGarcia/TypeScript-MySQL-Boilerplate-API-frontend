import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services';

@Component({
  standalone: false,
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;

  successMessage = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.alertService.clear();

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.accountService.forgotPassword(this.f['email'].value)
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.alertService.success(
            'Password reset email sent. Please check your email account.',
            { keepAfterRouteChange: true }
          );

          this.router.navigate(['/account/login']);
        },
        error: error => {
          this.errorMessage =
            error?.error?.message ||
            error?.message ||
            error ||
            'Unable to send reset password email. Please try again.';

          this.alertService.error(this.errorMessage);
        }
      });
  }
}