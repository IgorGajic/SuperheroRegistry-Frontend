import { Injectable } from '@angular/core';
import { type User } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedUser: User | null = null;

  constructor() {}

  getLoggedUser(): User | null {
    return this.loggedUser;
  }

  login(username: string, password: string): User | null {
    console.log(`Attempting login with username: ${username} and password: ${password}`);
    return null; //todo
  }

  logout() {
    this.loggedUser = null;
  }

  register(username: string, email: string, password: string): void {
    //todo: zvati register API
    this.login(username, password);
  }
}
