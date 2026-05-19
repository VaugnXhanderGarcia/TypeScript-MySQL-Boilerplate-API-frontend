import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService, AlertService } from '../_services';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  showFloatingError = false;
  returnUrl = '/profile';

  private errorTimer: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.showFloatingError = false;
    this.alertService.clear();

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.accountService.login(
      this.f['email'].value,
      this.f['password'].value
    ).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate([this.returnUrl]);
      },
      error: () => {
        this.loading = false;
        this.submitted = false;

        this.errorMessage = 'Invalid username or password';
        this.showFloatingError = true;

        this.form.reset();

        clearTimeout(this.errorTimer);
        this.errorTimer = setTimeout(() => {
          this.showFloatingError = false;
          this.errorMessage = '';
        }, 3500);
      }
    });
  }
}