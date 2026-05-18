import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AccountService, AlertService } from '../_services';

@Component({
  standalone: false,
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
  private formBuilder: FormBuilder,
  private router: Router,
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

  this.alertService.clear();

  if (this.form.invalid) {
    return;
  }

  this.loading = true;

  this.accountService.forgotPassword(this.form.value.email)
    .subscribe({
      next: () => {
        this.alertService.success(
          'Please check your email for password reset instructions',
          { keepAfterRouteChange: true }
        );
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/account/login']);
        }, 2000);
      },
      error: error => {
        this.alertService.error(error);
        this.loading = false;
      }
    });

}
}