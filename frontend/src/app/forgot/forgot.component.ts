import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from "@angular/router";
import {REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, FormBuilder, Validators} from "@angular/forms";

import {ForgotService} from './forgot.service';
import {FormValidationService} from "../shared/form-validation.service";

@Component({
  selector: 'forgot',
  template: require('./forgot.component.html'),
  directives: [REACTIVE_FORM_DIRECTIVES, ROUTER_DIRECTIVES],
  providers: [ForgotService]
})
export class ForgotComponent implements OnInit {
  forgotFormEmail:FormGroup;
  email:FormControl;
  forgotFormToken:FormGroup;
  token:FormControl;
  forgotFormPassword:FormGroup;
  password:FormControl;
  confirm:FormControl;

  private isEqualPass;

  constructor(private _forgot:ForgotService,
              private _router:Router,
              private _formBuilder:FormBuilder,
              private _validationService:FormValidationService) {
    this.isEqualPass = this._validationService.isEqualPass.bind(this);
    this.email = new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      FormValidationService.isEmail
    ]));
    this.token = new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8)
    ]));
    this.password = new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
      FormValidationService.isPassword
    ]));
    this.confirm = new FormControl('', Validators.compose([
      Validators.required,
      this.isEqualPass
    ]));
    this.forgotFormEmail = _formBuilder.group({
      email: this.email,
    });
    this.forgotFormToken = _formBuilder.group({
      token: this.token,
    });
    this.forgotFormPassword = _formBuilder.group({
      password: this.password,
      confirm: this.confirm
    });
  }

  ngOnInit() {

  }

  forgotSubmitEmail() {
    this._forgot.postEmail(this.forgotFormEmail.value).subscribe(

    );
  }

  forgotSubmitToken() {
    this._forgot.postToken(this.forgotFormToken.value).subscribe(

    );
  }

  forgotSubmitPassword() {
    this._forgot.postPassword(this.forgotFormPassword.value).subscribe(
      data => this._router.navigate(['/login'])
    );
  }
}