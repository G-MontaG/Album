import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";

import {LoginService} from "./login.service";
import {FormValidationService} from "../shared/form-validation.service";

@Component({
  selector: 'login',
  template: require('./login.component.html'),
  directives: [REACTIVE_FORM_DIRECTIVES],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;

  constructor(private _router: Router,
              private _loginService: LoginService,
              private _formBuilder: FormBuilder) {
    this.email = new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      FormValidationService.isEmail
    ]));
    this.password = new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
      FormValidationService.isPassword
    ]));
    this.loginForm = _formBuilder.group({
      email: this.email,
      password: this.password
    });
  }

  ngOnInit() {

  }

  onLoginSubmit() {
    this._loginService.postLogin(this.loginForm.value).subscribe(
      data => this._router.navigate(['Dashboard'])
    );
  }

  onGoogleSubmit() {
    this._loginService.getGoogle().subscribe(
      data => window.location.href = data.redirectUrl
    );
  }

  onFacebookSubmit() {
    this._loginService.getFacebook().subscribe(
      data => window.location.href = data.redirectUrl
    );
  }

  toSignup() {
    this._router.navigate(['Signup']);
  }

  toForgot() {
    this._router.navigate(['Forgot']);
  }
}