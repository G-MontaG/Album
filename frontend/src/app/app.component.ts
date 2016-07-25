import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';

@Component({
  selector: 'app',
  template: require('./app.component.html'),
  directives: [],
  providers: [HTTP_PROVIDERS]
})
export class AppComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}