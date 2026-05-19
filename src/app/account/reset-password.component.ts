import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccountService, AlertService } from '../_services';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  token = '';

  validating = true;
  validToken = false;
  submitted = false;
  loading = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    if (!this.token) {
      this.validating = false;
      this.validToken = false;
      this.errorMessage = 'Reset token is missing.';
      return;
    }

    this.accountService.validateResetToken( this.token )
      .subscribe({
        next: () => {
          this.validating = false;
          this.validToken = true;
        },
        error: error => {
          this.validating = false;
          this.validToken = false;

          this.errorMessage =
            error?.error?.message ||
            error?.message ||
            error ||
            'Reset link is invalid or expired.';
        }
      });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.alertService.clear();

    if (this.form.invalid) {
      return;
    }

    if (this.f['password'].value !== this.f['confirmPassword'].value) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;

    this.accountService.resetPassword({
      token: this.token,
      password: this.f['password'].value,
      confirmPassword: this.f['confirmPassword'].value
    })
      .subscribe({
        next: () => {
          this.loading = false;

          this.alertService.success(
            'Password changed successfully. You are now logged in.',
            { keepAfterRouteChange: true }
          );

          this.router.navigate(['/profile']);
        },
        error: error => {
          this.errorMessage =
            error?.error?.message ||
            error?.message ||
            error ||
            'Password reset failed.';

          this.alertService.error(this.errorMessage);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}