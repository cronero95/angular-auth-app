import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environments';

import { User, LoginResponse, AuthStatus, CheckTokenResponse } from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = environment.base_url;
  private httpClient = inject(HttpClient);

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser =  computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() { }

  login(email: string, password: string): Observable<boolean> {

    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.httpClient.post<LoginResponse>(url, body)
      .pipe(
        tap(({user, token}) => {
          this._currentUser.set(user);
          this._authStatus.set(AuthStatus.authenticated);
          localStorage.setItem('token', token);
        }),
        map(
          () => true
        ),
        catchError(
          err =>  throwError(() => err.error.message)
        ),
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;

    const token = localStorage.getItem('token');
    if(!token) return of(false);

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.httpClient.get<CheckTokenResponse>(url, {headers})
      .pipe(
        tap(({user, token}) => {
          this._currentUser.set(user);
          this._authStatus.set(AuthStatus.authenticated);
          localStorage.setItem('token', token);
        }),
        map(
          () => true
        ),
        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        }),
      );
  }

}
