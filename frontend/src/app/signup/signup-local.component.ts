import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Router, ROUTER_DIRECTIVES} from '@angular/router';

import {SignupService} from './signup.service';
import {FormValidationService} from "../shared/form-validation.service";

@Component({
  selector: 'signup-local',
  template: require('./signup-local.component.html'),
  directives: [REACTIVE_FORM_DIRECTIVES, ROUTER_DIRECTIVES],
  providers: [SignupService]
})
export class SignupLocalComponent implements OnInit {
  signupLocalForm:FormGroup;
  firstname:FormControl;
  lastname:FormControl;
  email:FormControl;
  password:FormControl;
  confirm:FormControl;

  private isEqual;

  constructor(private _router:Router,
              private _signupService:SignupService,
              private _formBuilder:FormBuilder,
              private _validationService: FormValidationService) {
    this.isEqual = this._validationService.isEqual.bind(this);
    this.firstname = new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(2)
    ]));
    this.lastname = new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(2)
    ]));
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
    this.confirm = new FormControl('', Validators.compose([
      Validators.required,
      this.isEqual
    ]));
    this.signupLocalForm = _formBuilder.group({
      profile: new FormGroup({
        firstname: this.firstname,
        lastname: this.lastname,
      }),
      email: this.email,
      password: this.password,
      confirm: this.confirm
    });
  }

  ngOnInit() {

  }

  toSignupExternal() {
    this._router.navigate(['SignupExternal']);
  }

  signupLocalSubmit() {
    delete this.signupLocalForm.value.confirm;
    this._signupService.postSignupLocal(this.signupLocalForm.value).subscribe(
      data => this._router.navigateByUrl('/dashboard')
    );
  }
}