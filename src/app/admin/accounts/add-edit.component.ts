import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../../_services';
import { Role } from '../../_models';
import { MustMatch } from '../../_helpers';

@Component({
  standalone: false,
  templateUrl: './add-edit.component.html'
})
export class AddEditComponent implements OnInit {
  form!: FormGroup;
  id?: string;
  isAddMode = true;
  loading = false;
  submitted = false;
  Role = Role;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    const passwordValidators = this.isAddMode
      ? [Validators.required, Validators.minLength(6)]
      : [Validators.minLength(6)];

    this.form = this.formBuilder.group({
  title: ['', Validators.required],
  firstName: ['', Validators.required],
  lastName: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  role: ['User', Validators.required],
  password: ['', [Validators.minLength(6), ...(this.isAddMode ? [Validators.required] : [])]],
  confirmPassword: [''],
  acceptTerms: [false, Validators.requiredTrue]
}, {
  validators: MustMatch('password', 'confirmPassword')
});

    if (!this.isAddMode && this.id) {
      this.accountService.getById(this.id)
  .pipe(first())
  .subscribe(x => {
    this.form.patchValue({
      title: x.title,
      firstName: x.firstName,
      lastName: x.lastName,
      email: x.email,
      role: x.role,
      acceptTerms: !!x.acceptTerms
    });
  });
    }
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

    if (this.isAddMode) {
      this.createAccount();
    } else {
      this.updateAccount();
    }
  }

  private createAccount() {
    this.accountService.create(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Account added successfully.', {
            keepAfterRouteChange: true
          });
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }

  private updateAccount() {
    const params = this.form.value;

    if (!params.password) {
      delete params.password;
      delete params.confirmPassword;
    }

    this.accountService.update(this.id!, params)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Account updated successfully.', {
            keepAfterRouteChange: true
          });
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }
}