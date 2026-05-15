import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService, AlertService } from '../_services';
import { MustMatch } from '../_helpers';

enum TokenStatus {
  Validating,
  Valid,
  Invalid
}

@Component({
  standalone: false,
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  TokenStatus = TokenStatus;
  tokenStatus = TokenStatus.Validating;
  form!: FormGroup;
  token!: string;
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

    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: MustMatch('password', 'confirmPassword')
    });

    this.accountService.validateResetToken(this.token).subscribe({
      next: () => {
        this.tokenStatus = TokenStatus.Valid;
      },
      error: () => {
        this.tokenStatus = TokenStatus.Invalid;
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

    this.accountService.resetPassword(
      this.token,
      this.f['password'].value,
      this.f['confirmPassword'].value
    ).subscribe({
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
}