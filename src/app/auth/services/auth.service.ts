import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, ErrorResponse, User } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = environment.baseUrl
  private _user!: User;

  constructor(private http: HttpClient) { }

  get user(){
    return {...this._user};
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth`, { email, password })
      .pipe(
        tap(res => {
          if(res.ok){
            this._user = {
              token: res.token!,
              uid: res.uid!,
              name: res.name!
            }
          }
        }),
        map(resp => resp.ok),
        catchError((err) => of(err))
      )
  }
}
