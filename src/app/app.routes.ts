import { Routes } from '@angular/router';
import { LoginComponent } from '../features/auth/login/login.component';
import { RegisterComponent } from '../features/auth/register/register.component';
import { LangingPageComponent } from '../features/auth/landing/langing-page.component';
import { MyHeroesComponent } from '../features/my-heroes/my-heroes-component';

export const routes: Routes = [
    {
        path: '',
        component: LangingPageComponent
    },
    { 
        path: 'login', 
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'my-heroes',
        component: MyHeroesComponent
    }
];
