import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService, AlertService } from '../_services';
import { MustMatch } from '../_helpers';

@Component({
  standalone: false,
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  token: string = '';
  loading = false;
  submitted = false;
  validating = true;
  tokenValid = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];

    if (!this.token) {
      this.validating = false;
      this.tokenValid = false;
      return;
    }

    this.accountService.validateResetToken(this.token).subscribe({
      next: () => {
        this.tokenValid = true;
        this.validating = false;
      },
      error: () => {
        this.tokenValid = false;
        this.validating = false;
        this.alertService.error('Invalid or expired reset link');
      }
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: MustMatch('password', 'confirmPassword')
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.accountService.resetPassword(
      this.token,
      this.f['password'].value,
      this.f['confirmPassword'].value
    ).subscribe({
      next: () => {
        this.alertService.success('Password reset successful. Please log in with your new password.', {
          keepAfterRouteChange: true
        });
        this.router.navigate(['/account/login']);
      },
      error: error => {
        this.alertService.error(error);
        this.loading = false;
      }
    });
  }
}