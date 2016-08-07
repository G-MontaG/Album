import {provideRouter, RouterConfig} from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {SignupLocalComponent} from './signup/signup-local.component';
import {SignupExternalComponent} from './signup/signup-external.component';
import {GoogleComponent} from './auth/google.component';
import {FacebookComponent} from './auth/facebook.component';
import {VerifyComponent} from './verify/verify.component';
import {ForgotComponent} from './forgot/forgot.component';
import {ResetComponent} from './reset/reset.component';
import {DashboardComponent} from './dashboard/dashboard.component';

const routes:RouterConfig = [
  {path: '', component: LandingComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent, children: [
    { path: 'local',  component: SignupLocalComponent },
    { path: '',     component: SignupExternalComponent }
  ]},
  {path: 'google-auth/response', component: GoogleComponent},
  {path: 'facebook-auth/response', component: FacebookComponent},
  {path: 'verify', component: VerifyComponent},
  {path: 'forgot', component: ForgotComponent},
  {path: 'reset', component: ResetComponent},
  {path: 'dashboard', component: DashboardComponent},
];

export const appRouterProviders = [
  provideRouter(routes)
];