import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {routes} from './app.routes';
import {FormValidationService} from "./shared/form-validation.service";
import {ErrorHandlerService} from './shared/errorHandler.service';

import {LandingComponent} from "./landing/landing.component";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {SignupLocalComponent} from "./signup/signup-local.component";
import {SignupExternalComponent} from "./signup/signup-external.component";
import {VerifyComponent} from "./verify/verify.component";
import {ForgotComponent} from "./forgot/forgot.component";
import {ResetComponent} from "./reset/reset.component";
import {FacebookComponent} from "./auth/facebook.component";
import {GoogleComponent} from "./auth/google.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

@NgModule({
  declarations: [AppComponent,
    LandingComponent,
    LoginComponent,
    SignupComponent,
    SignupLocalComponent,
    SignupExternalComponent,
    VerifyComponent,
    ForgotComponent,
    ResetComponent,
    FacebookComponent,
    GoogleComponent,
    DashboardComponent],
  imports: [BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule],
  providers: [FormValidationService, ErrorHandlerService],
  bootstrap: [AppComponent],
})
export class AppModule {
}