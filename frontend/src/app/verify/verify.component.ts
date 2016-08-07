import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Router, ROUTER_DIRECTIVES} from "@angular/router";

import {VerifyService} from './verify.service';

@Component({
  selector: 'verify',
  template: require('./verify.component.html'),
  directives: [REACTIVE_FORM_DIRECTIVES, ROUTER_DIRECTIVES],
  providers: [VerifyService]
})
export class VerifyComponent implements OnInit {
  verifyEmailForm:FormGroup;
  token:FormControl;
  
  constructor(private _verify:VerifyService,
              private _router:Router,
              private _formBuilder:FormBuilder) {
    this.token = new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8)
    ]));
    this.verifyEmailForm = _formBuilder.group({
      token: this.token
    })
  }

  ngOnInit() {
  }
  
  verifyEmailSubmit() {
    this._verify.postToken(this.verifyEmailForm.value).subscribe(
      data => this._router.navigate(['Dashboard'])
    )
  }
}