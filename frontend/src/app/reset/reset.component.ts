import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from "@angular/router";
import {REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, FormBuilder, Validators} from "@angular/forms";

import {ResetService} from './reset.service.ts';
import {FormValidationService} from "../shared/form-validation.service.ts";

@Component({
  selector: 'reset',
  template: require('./reset.component.html'),
  directives: [REACTIVE_FORM_DIRECTIVES, ROUTER_DIRECTIVES],
  providers: [ResetService]
})
export class ResetComponent implements OnInit {
  resetPasswordForm:FormGroup;
  password:FormControl;
  newPassword:FormControl;
  confirm:FormControl;

  private isEqualNewPass;

  constructor(private _reset:ResetService,
              private _router:Router,
              private _formBuilder:FormBuilder,
              private _validationService:FormValidationService) {
    this.isEqualNewPass = this._validationService.isEqualNewPass.bind(this);
    this.password = new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
      FormValidationService.isPassword
    ]));
    this.newPassword = new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
      FormValidationService.isPassword
    ]));
    this.confirm = new FormControl('', Validators.compose([
      Validators.required,
      this.isEqualNewPass
    ]));
    this.resetPasswordForm = _formBuilder.group({
      password: this.password,
      newPassword: this.newPassword,
      confirm: this.confirm
    });
  }

  ngOnInit() {
  }

  resetPasswordSubmit() {
    delete this.resetPasswordForm.value.confirm;
    this._reset.postResetPassword(this.resetPasswordForm.value).subscribe(
      data => this._router.navigate(['/dashboard'])
    );
  }
}