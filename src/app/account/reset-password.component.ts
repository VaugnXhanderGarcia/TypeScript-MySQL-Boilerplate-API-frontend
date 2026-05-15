import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService, AlertService } from '../_services';

enum TokenStatus {
  Validating = 'Validating',
  Valid = 'Valid',
  Invalid = 'Invalid'
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: false
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  token!: string;
  tokenStatus = TokenStatus.Validating;
  TokenStatus = TokenStatus;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.mustMatch('password', 'confirmPassword')
    });

    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.tokenStatus = TokenStatus.Invalid;
      this.alertService.error('Reset token is missing.');
      return;
    }

    this.accountService.validateResetToken(this.token).subscribe({
      next: () => {
        this.tokenStatus = TokenStatus.Valid;
      },
      error: () => {
        this.tokenStatus = TokenStatus.Invalid;
        this.alertService.error('Reset token is invalid or expired.');
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear?.();

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.accountService.resetPassword({
      token: this.token,
      password: this.f['password'].value,
      confirmPassword: this.f['confirmPassword'].value
    }).subscribe({
      next: () => {
        this.alertService.success('Password reset successful. You can now login.', {
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

  private mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}