import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          this.setLocalStorage(response.token, response.user);
        }),
      );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, {
      username,
      password,
    });
  }

  private setLocalStorage(token: string, user: any): void {
    //todo
  }
}
