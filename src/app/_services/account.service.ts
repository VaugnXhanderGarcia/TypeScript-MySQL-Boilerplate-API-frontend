import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Account } from '../_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private accountSubject: BehaviorSubject<Account | null>;
  public account: Observable<Account | null>;

  private baseUrl = `${environment.apiUrl}/accounts`;
  private refreshTokenTimeout?: any;

  constructor(private http: HttpClient) {
    this.accountSubject = new BehaviorSubject<Account | null>(null);
    this.account = this.accountSubject.asObservable();
  }

  public get accountValue(): Account | null {
    return this.accountSubject.value;
  }

  login(email: string, password: string) {
    return this.http
      .post<Account>(
        `${this.baseUrl}/authenticate`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        map((account: Account) => {
          this.accountSubject.next(account);
          this.startRefreshTokenTimer();
          return account;
        })
      );
  }

  logout() {
    return this.http
      .post<any>(`${this.baseUrl}/revoke-token`, {}, { withCredentials: true })
      .pipe(
        finalize(() => {
          this.stopRefreshTokenTimer();
          this.accountSubject.next(null);
          window.location.href = '/account/login';
        })
      )
      .subscribe({
        error: () => {
          this.stopRefreshTokenTimer();
          this.accountSubject.next(null);
          window.location.href = '/account/login';
        }
      });
  }

  refreshToken() {
    return this.http
      .post<Account>(`${this.baseUrl}/refresh-token`, {}, { withCredentials: true })
      .pipe(
        map((account: Account) => {
          this.accountSubject.next(account);
          this.startRefreshTokenTimer();
          return account;
        })
      );
  }

  register(account: any) {
    return this.http.post(`${this.baseUrl}/register`, account);
  }

  verifyEmail(token: string) {
    return this.http.post(`${this.baseUrl}/verify-email`, { token });
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  validateResetToken(token: string) {
    return this.http.post<any>(`${this.baseUrl}/validate-reset-token`, { token });
  }

  resetPassword(params: any) {
    return this.http
      .post<Account>(`${this.baseUrl}/reset-password`, params, { withCredentials: true })
      .pipe(
        map((account: Account) => {
          this.accountSubject.next(account);
          this.startRefreshTokenTimer();
          return account;
        })
      );
  }

  getAll() {
    return this.http.get<Account[]>(this.baseUrl);
  }

  getById(id: string) {
    return this.http.get<Account>(`${this.baseUrl}/${id}`);
  }

  create(params: any) {
    return this.http.post(this.baseUrl, params);
  }

  update(id: string, params: any) {
    return this.http.put(`${this.baseUrl}/${id}`, params).pipe(
      map((account: any) => {
        const currentAccount = this.accountValue;

        if (account.id === currentAccount?.id) {
          account = { ...currentAccount, ...account };
          this.accountSubject.next(account);
        }

        return account;
      })
    );
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      map((response: any) => {
        const currentAccount = this.accountValue;

        if (id === currentAccount?.id) {
          this.accountSubject.next(null);
        }

        return response;
      })
    );
  }

  private startRefreshTokenTimer() {
    const account = this.accountValue;

    if (!account?.jwtToken) {
      return;
    }

    const jwtToken = JSON.parse(atob(account.jwtToken.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;

    if (timeout <= 0) {
      return;
    }

    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().subscribe({ error: () => this.logout() });
    }, timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}