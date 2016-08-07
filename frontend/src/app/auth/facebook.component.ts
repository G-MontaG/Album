import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {FacebookService} from './facebook.service';

@Component({
  selector: 'facebook',
  template: require('./facebook.component.html'),
  directives: [],
  providers: [FacebookService]
})
export class FacebookComponent implements OnInit {
  constructor(private _router:Router,
              private _facebookService:FacebookService) {
  }

  ngOnInit() {
    this._facebookService.getFacebookUser().subscribe(
      data => this._router.navigate(['Dashboard'])
    );
  }
}