import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userJson = localStorage.getItem('user');
    
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user && user.token) {
          return true;
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
      }
    }
    
    // Redirect to login if no valid user found
    this.router.navigate(['/login']);
    return false;
  }
}
