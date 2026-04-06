import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { type User } from '../../features/model/user.model';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './nav-bar-component.html',
  styleUrl: './nav-bar-component.css',
})
export class NavBarComponent {  
  constructor(private router: Router, private authService: AuthService) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  
  onHome(){
    this.navigateTo('/');
  }

  onLogin() {
    this.navigateTo('/login');
  }

  onLogout() {
    this.authService.logout();
    this.navigateTo('/');
  }

  get loggedUser(): User | null {
    return this.authService.getLoggedUser();
  }
}
