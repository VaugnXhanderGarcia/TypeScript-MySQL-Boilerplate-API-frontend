import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../../_services';
import { Account } from '../../_models';

@Component({
  standalone: false,
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  accounts?: Account[];
  loading = false;

  constructor(
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loading = true;

    this.accountService.getAll()
      .pipe(first())
      .subscribe({
        next: accounts => {
          this.accounts = accounts;
          this.loading = false;
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }

  deleteAccount(id: string) {
    const confirmed = confirm('Are you sure you want to delete this account?');

    if (!confirmed) {
      return;
    }

    const account = this.accounts?.find(x => x.id === id);

    if (account) {
      account.isDeleting = true;
    }

    this.accountService.delete(id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.accounts = this.accounts?.filter(x => x.id !== id);
          this.alertService.success('Account deleted successfully.');
        },
        error: error => {
          this.alertService.error(error);

          if (account) {
            account.isDeleting = false;
          }
        }
      });
  }
}