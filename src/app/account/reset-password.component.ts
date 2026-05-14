import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services';

type TokenStatus = 'Validating' | 'Valid' | 'Invalid';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: false
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  token!: string;
  tokenStatus: TokenStatus = 'Validating';
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
      validators: this.mustMatch('password', 'confirmPassword')
    });

    this.accountService.validateResetToken(this.token)
      .pipe(first())
      .subscribe({
        next: () => {
          this.tokenStatus = 'Valid';
        },
        error: () => {
          this.tokenStatus = 'Invalid';
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
    )
    .pipe(first())
    .subscribe({
      next: () => {
        this.alertService.success('Password reset successful. You can now log in.', {
          keepAfterRouteChange: true
        });

        this.router.navigate(['/account/login']);
      },
      error: error => {
        this.loading = false;
        this.alertService.error(error?.error?.message || error?.message || 'Password reset failed.');
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