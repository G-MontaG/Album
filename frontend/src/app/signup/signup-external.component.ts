import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {SignupService} from "./signup.service";

@Component({
  selector: 'signup-external',
  template: require('./signup-external.component.html'),
  directives: [ROUTER_DIRECTIVES],
  providers: [SignupService]
})
export class SignupExternalComponent implements OnInit {
  constructor(private _signupService:SignupService) {
  }

  ngOnInit() {
  }

  signupGoogleSubmit() {
    this._signupService.getGoogle().subscribe(
      data => window.location.href = data.redirectUrl
    );
  }

  signupFacebookSubmit() {
    this._signupService.getFacebook().subscribe(
      data => window.location.href = data.redirectUrl
    );
  }
}