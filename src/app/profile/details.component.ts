import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AccountService, AlertService } from '../_services';
import { Account } from '../_models';
import { MustMatch } from '../_helpers';

@Component({
  standalone: false,
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {
  account: Account | null;
  passwordForm!: FormGroup;
  showPasswordForm = false;
  loadingPassword = false;
  submittedPassword = false;
  resetToken: string | null = null;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private route: ActivatedRoute
  ) {
    this.account = this.accountService.accountValue;
    this.initPasswordForm();
  }

  ngOnInit() {
    this.resetToken = this.route.snapshot.queryParams['resetToken'];
    if (this.resetToken) {
      this.showPasswordForm = true;
    }
  }

  initPasswordForm() {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: MustMatch('password', 'confirmPassword')
    });
  }

  get f() {
    return this.passwordForm.controls;
  }

  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
    this.submittedPassword = false;
    this.passwordForm.reset();
    this.alertService.clear();
  }

  onChangePassword() {
    this.submittedPassword = true;
    this.alertService.clear();

    if (this.passwordForm.invalid) {
      return;
    }

    this.loadingPassword = true;

    if (this.resetToken) {
      this.accountService.resetPassword(
        this.resetToken,
        this.f['password'].value,
        this.f['confirmPassword'].value
      ).subscribe({
        next: () => {
          this.alertService.success('Password reset successful');
          this.loadingPassword = false;
          this.showPasswordForm = false;
          this.passwordForm.reset();
          this.submittedPassword = false;
          this.resetToken = null;
        },
        error: error => {
          this.alertService.error(error);
          this.loadingPassword = false;
        }
      });
    } else {
      this.accountService.update(this.account!.id.toString(), {
        password: this.f['password'].value,
        confirmPassword: this.f['confirmPassword'].value
      }).subscribe({
        next: () => {
          this.alertService.success('Password changed successfully');
          this.loadingPassword = false;
          this.showPasswordForm = false;
          this.passwordForm.reset();
          this.submittedPassword = false;
        },
        error: error => {
          this.alertService.error(error);
          this.loadingPassword = false;
        }
      });
    }
  }
}