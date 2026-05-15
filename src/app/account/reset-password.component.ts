import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService, AlertService } from '../_services';

enum TokenStatus {
  Validating,
  Valid,
  Invalid
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: false
})
export class ResetPasswordComponent implements OnInit {
  TokenStatus = TokenStatus;
  tokenStatus = TokenStatus.Validating;
  token = '';
  form!: FormGroup;
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
    this.token = this.route.snapshot.queryParams['token'];

    this.form = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.mustMatch('password', 'confirmPassword')
      }
    );

    if (!this.token) {
      this.tokenStatus = TokenStatus.Invalid;
      return;
    }

    this.accountService.validateResetToken(this.token).subscribe({
      next: () => {
        this.tokenStatus = TokenStatus.Valid;
      },
      error: () => {
        this.tokenStatus = TokenStatus.Invalid;
        this.alertService.error('Reset password token is invalid or expired.');
      }
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

    this.accountService
      .resetPassword(
        this.token,
        this.f['password'].value,
        this.f['confirmPassword'].value
      )
      .subscribe({
        next: () => {
          this.alertService.success('Password reset successful. You can now log in.', {
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
    return (formGroup: AbstractControl) => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }

      return null;
    };
  }
}