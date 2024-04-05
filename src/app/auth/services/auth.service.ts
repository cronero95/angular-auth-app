import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '../../../environments/environments';

import { User, LoginResponse, AuthStatus } from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = environment.base_url;
  private httpClient = inject(HttpClient);

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  constructor() { }

  login(email: string, password: string): Observable<boolean> {

    return of(true);
  }
}
