import {provideRouter, RouterConfig} from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {SignupLocalComponent} from './signup/signup-local.component';
import {SignupExternalComponent} from './signup/signup-external.component';

const routes:RouterConfig = [
  {path: '', component: LandingComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent, children: [
    { path: 'local',  component: SignupLocalComponent },
    { path: '',     component: SignupExternalComponent }
  ]}
];

export const appRouterProviders = [
  provideRouter(routes)
];