import {provideRouter, RouterConfig} from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';

const routes:RouterConfig = [
  {path: '', component: LandingComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent}
];

export const appRouterProviders = [
  provideRouter(routes)
];