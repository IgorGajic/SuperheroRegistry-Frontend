import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable, map, tap } from 'rxjs';
import { type User } from '../../../model/user.model';

export interface AuthResponseDto {
  token: string;
  username: string;
  userId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private loggedUser: User | null = null;

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        this.loggedUser = JSON.parse(userJson);
        // If user doesn't have an ID (old storage format), extract it from token
        if (this.loggedUser && !this.loggedUser.id && this.loggedUser.token) {
          this.loggedUser.id = this.extractUserIdFromToken(this.loggedUser.token);
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        this.loggedUser = null;
      }
    }
  }

  getLoggedUser(): User | null {
    return this.loggedUser;
  }

  login(username: string, password: string): Observable<User> {
    // Clear any previous session before attempting new login
    this.clearLocalStorage();
    this.loggedUser = null;
    
    return this.http
      .post<AuthResponseDto>(`${this.baseUrl}/login`, {
        username,
        password,
      })
      .pipe(
        map((response) => this.mapToUser(response)),
        tap((user) => {
          this.loggedUser = user;
          this.saveUserToStorage(user);
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
        this.saveUserToStorage(user);
      }),
    );
  }

  logout(): void {
    this.loggedUser = null;
    this.clearLocalStorage();
  }

  private mapToUser(response: AuthResponseDto): User {
    const userId = response.userId || this.extractUserIdFromToken(response.token);
    return {
      id: userId,
      username: response.username,
      token: response.token,
    };
  }

  private extractUserIdFromToken(token: string): string {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      // The user ID is stored in the "nameidentifier" claim
      return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '';
    } catch (error) {
      console.error('Failed to extract user ID from token:', error);
      return '';
    }
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearLocalStorage(): void {
    localStorage.removeItem('user');
  }
}
