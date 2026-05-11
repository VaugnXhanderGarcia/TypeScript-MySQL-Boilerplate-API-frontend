import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../../_services';
import { Account } from '../../_models';

@Component({
  templateUrl: './list.component.html',
  standalone: false
})
export class ListComponent implements OnInit {
  accounts: Account[] = [];
  currentAccount?: Account | null;
  errorMessage = '';

  constructor(
    private accountService: AccountService,
    private alertService: AlertService
  ) {
    this.currentAccount = this.accountService.accountValue;
  }

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.errorMessage = '';

    this.accountService.getAll()
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          console.log('RAW ACCOUNTS RESPONSE:', response);
          console.log('RESPONSE TYPE:', typeof response);
          console.log('IS ARRAY:', Array.isArray(response));

          let result: any[] = [];

          if (Array.isArray(response)) {
            result = response;
          }

          else if (typeof response === 'string') {
            try {
              const parsed = JSON.parse(response);

              if (Array.isArray(parsed)) {
                result = parsed;
              } else {
                result = this.extractArrayFromObject(parsed);
              }
            } catch (error) {
              console.error('Failed to parse response string:', error);
            }
          }

          else if (response && typeof response === 'object') {
            result = this.extractArrayFromObject(response);
          }

          this.accounts = result;

          console.log('FINAL ACCOUNTS ARRAY:', this.accounts);
          console.log('FINAL ACCOUNTS LENGTH:', this.accounts.length);
        },
        error: (error) => {
          console.error('ACCOUNTS ERROR:', error);
          this.errorMessage = 'Unable to load accounts. Please make sure you are logged in as Admin.';
        }
      });
  }

  extractArrayFromObject(response: any): any[] {
    if (Array.isArray(response.accounts)) {
      return response.accounts;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (Array.isArray(response.items)) {
      return response.items;
    }

    if (Array.isArray(response.rows)) {
      return response.rows;
    }

    if (Array.isArray(response.result)) {
      return response.result;
    }

    const firstArrayValue = Object.values(response).find(value => Array.isArray(value));

    if (Array.isArray(firstArrayValue)) {
      return firstArrayValue;
    }

    return [];
  }

  deleteAccount(id: string) {
    if (String(this.currentAccount?.id) === String(id)) {
      this.alertService.error('You cannot delete your own account.');
      return;
    }

    const account = this.accounts.find(x => String(x.id) === String(id));

    if (!account) {
      return;
    }

    account.isDeleting = true;

    this.accountService.delete(id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.accounts = this.accounts.filter(x => String(x.id) !== String(id));
          this.alertService.success('Account deleted successfully.');
        },
        error: (error) => {
          account.isDeleting = false;
          this.alertService.error(error);
        }
      });
  }
}