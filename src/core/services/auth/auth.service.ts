import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable, map, tap } from 'rxjs';
import { type User } from '../../../model/user.model';

export interface AuthResponseDto {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private loggedUser: User | null = null;

  constructor(private http: HttpClient) {}

  getLoggedUser(): User | null {
    return this.loggedUser;
  }

  login(username: string, password: string): Observable<User> {
    return this.http
      .post<AuthResponseDto>(`${this.baseUrl}/login`, {
        username,
        password,
      })
      .pipe(
        map((response) => this.mapToUser(response)),
        tap((user) => {
          this.loggedUser = user;
          this.setLocalStorage(user.token);
        }),
      );
  }

  register(username: string, password: string): Observable<User> {
    return this.http.post<AuthResponseDto>(`${this.baseUrl}/register`, {
      username,
      password,
    })
    .pipe(
      map((response) => this.mapToUser(response)),
      tap((user) => {
        this.loggedUser = user;
        this.setLocalStorage(user.token);
      }),
    );
  }

  logout(): void {
    this.loggedUser = null;
    this.clearLocalStorage();
  }

  private mapToUser(response: AuthResponseDto): User {
    return {
      username: response.username,
      token: response.token,
    };
  }

  private setLocalStorage(token: string): void {
    localStorage.setItem('token', token);
  }

  private clearLocalStorage(): void {
    localStorage.removeItem('token');
  }
}
