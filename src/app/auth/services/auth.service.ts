import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  User,
} from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = environment.baseUrl;
  private _user!: User;

  constructor(private http: HttpClient) {}

  get user() {
    return { ...this._user };
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth`, { email, password })
      .pipe(
        tap((res) => {
          if (res.ok) {
            this.setUserData(res);
          }
        }),
        map((resp) => resp.ok),
        catchError((err) => of(err))
      );
  }

  validateToken(): Observable<boolean> {
    const currentToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set('x-token', currentToken || '');
    return this.http
      .get<AuthResponse>(`${this.baseUrl}/auth/renew`, { headers })
      .pipe(
        map((res) => {
          this.setUserData(res);
          return res.ok;
        }),
        catchError((err) => of(false))
      );
  }

  logout(){
    localStorage.clear();
  }

  setUserData(res: AuthResponse) {
    localStorage.setItem('token', res.token!);
    this._user = {
      token: res.token!,
      uid: res.uid!,
      name: res.name!,
    };
  }
}
