import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-langing-page.component',
  imports: [],
  templateUrl: './langing-page.component.html',
  styleUrl: './langing-page.component.css',
})
export class LangingPageComponent {
  constructor(private router: Router) {}
  
  onLogin(){
    this.router.navigate(['/login']);
  }

  onRegister(){
    this.router.navigate(['/register']);
  }
}
