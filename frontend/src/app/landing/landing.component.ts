import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  selector: 'landing',
  template: require('./landing.component.html'),
  directives: [ROUTER_DIRECTIVES],
  providers: []
})
export class LandingComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}