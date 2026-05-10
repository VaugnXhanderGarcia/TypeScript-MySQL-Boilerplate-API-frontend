import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, finalize, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { Account } from '../_models';

const baseUrl = `${environment.apiUrl}/accounts`;

@Injectable({ providedIn: 'root' })
export class AccountService {
  private accountSubject: BehaviorSubject<Account | null>;
  public account: Observable<Account | null>;
  private refreshTokenTimeout?: any;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.accountSubject = new BehaviorSubject<Account | null>(null);
    this.account = this.accountSubject.asObservable();
  }

  public get accountValue() {
    return this.accountSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<Account>(
      `${baseUrl}/authenticate`,
      { email, password },
      { withCredentials: true }
    ).pipe(map(account => {
      this.accountSubject.next(account);
      this.startRefreshTokenTimer();
      return account;
    }));
  }

  logout() {
    this.http.post<any>(
      `${baseUrl}/revoke-token`,
      {},
      { withCredentials: true }
    ).subscribe();

    this.stopRefreshTokenTimer();
    this.accountSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  refreshToken() {
    return this.http.post<Account>(
      `${baseUrl}/refresh-token`,
      {},
      { withCredentials: true }
    ).pipe(map(account => {
      this.accountSubject.next(account);
      this.startRefreshTokenTimer();
      return account;
    }));
  }

  register(account: any) {
    return this.http.post(`${baseUrl}/register`, account);
  }

  verifyEmail(token: string) {
    return this.http.post(`${baseUrl}/verify-email`, { token });
  }

  forgotPassword(email: string) {
    return this.http.post(`${baseUrl}/forgot-password`, { email });
  }

  validateResetToken(token: string) {
    return this.http.post(`${baseUrl}/validate-reset-token`, { token });
  }

  resetPassword(token: string, password: string, confirmPassword: string) {
    return this.http.post(`${baseUrl}/reset-password`, {
      token,
      password,
      confirmPassword
    });
  }

  getAll() {
    return this.http.get<Account[]>(baseUrl);
  }

  getById(id: string) {
    return this.http.get<Account>(`${baseUrl}/${id}`);
  }

  create(params: any) {
    return this.http.post(baseUrl, params);
  }

  update(id: string, params: any) {
    return this.http.put(`${baseUrl}/${id}`, params)
      .pipe(map((account: any) => {
        if (account.id === this.accountValue?.id) {
          account = { ...this.accountValue, ...account };
          this.accountSubject.next(account);
        }

        return account;
      }));
  }

  delete(id: string) {
    return this.http.delete(`${baseUrl}/${id}`)
      .pipe(finalize(() => {
        if (id === this.accountValue?.id) {
          this.logout();
        }
      }));
  }

  private startRefreshTokenTimer() {
    const jwtToken = this.accountValue?.jwtToken;
    if (!jwtToken) return;

    const jwtTokenPayload = JSON.parse(atob(jwtToken.split('.')[1]));
    const expires = new Date(jwtTokenPayload.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);

    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().subscribe();
    }, timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}