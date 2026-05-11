import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services';
import { Account } from '../_models';

@Component({
  templateUrl: './update.component.html',
  standalone: false
})
export class UpdateComponent implements OnInit {
  account?: Account | null;
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService
  ) {
    this.account = this.accountService.accountValue;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: [this.account?.title, Validators.required],
      firstName: [this.account?.firstName, Validators.required],
      lastName: [this.account?.lastName, Validators.required],
      email: [this.account?.email, [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: ['']
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

    if (this.f['password'].value && this.f['password'].value !== this.f['confirmPassword'].value) {
      this.alertService.error('Password and confirm password do not match.');
      return;
    }

    this.loading = true;

    this.accountService.update(String(this.account.id), this.form.value)
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
}