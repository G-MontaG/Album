import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from "@angular/router";

@Component({
  selector: 'signup',
  template: require('./signup.component.html'),
  directives: [ROUTER_DIRECTIVES],
  providers: []
})
export class SignupComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}