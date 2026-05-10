import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services';
import { Account } from '../_models';
import { MustMatch } from '../_helpers';

@Component({
  standalone: false,
  templateUrl: './update.component.html'
})
export class UpdateComponent implements OnInit {
  form!: FormGroup;
  account: Account | null = null;
  loading = false;
  submitted = false;
  deleting = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.account = this.accountService.accountValue;

    this.form = this.formBuilder.group({
      title: [this.account?.title, Validators.required],
      firstName: [this.account?.firstName, Validators.required],
      lastName: [this.account?.lastName, Validators.required],
      email: [this.account?.email, [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
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

    if (this.form.invalid || !this.account) {
      return;
    }

    this.loading = true;

    const params = this.form.value;

    if (!params.password) {
      delete params.password;
      delete params.confirmPassword;
    }

    this.accountService.update(this.account.id, params)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Profile updated successfully.');
          this.loading = false;
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }

  onDelete() {
    if (!this.account) return;

    const confirmed = confirm('Are you sure you want to delete your account?');

    if (!confirmed) {
      return;
    }

    this.deleting = true;

    this.accountService.delete(this.account.id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Account deleted successfully.');
        },
        error: error => {
          this.alertService.error(error);
          this.deleting = false;
        }
      });
  }
}