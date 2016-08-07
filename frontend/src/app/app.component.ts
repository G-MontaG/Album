import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {FormValidationService} from "./shared/form-validation.service";

@Component({
  selector: 'app',
  template: require('./app.component.html'),
  directives: [ROUTER_DIRECTIVES],
  providers: [FormValidationService]
})
export class AppComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}