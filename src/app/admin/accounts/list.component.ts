import { Component, OnInit } from '@angular/core';

import { AccountService } from '../../_services';
import { Account } from '../../_models';

@Component({
  standalone: false,
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  accounts: Account[] = [];
  loading = false;
  error = '';

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.loadAccounts();
  }

  private loadAccounts() {
    this.loading = true;
    this.error = '';

    this.accountService.getAll().subscribe({
      next: (accounts: Account[]) => {
        this.accounts = accounts || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Unable to load accounts.';
      }
    });
  }

  deleteAccount(id: string) {
    const account = this.accounts.find(x => x.id === id);
    if (!account) return;

    if (!confirm('Are you sure you want to delete this account?')) return;

    account.isDeleting = true;

    this.accountService.delete(id).subscribe({
      next: () => {
        this.accounts = this.accounts.filter(x => x.id !== id);
      },
      error: () => {
        account.isDeleting = false;
        alert('Unable to delete account.');
      }
    });
  }
}