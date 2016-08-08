import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {GoogleService} from './google.service';

@Component({
  selector: 'google',
  template: require('./google.component.html'),
  directives: [],
  providers: [GoogleService]
})
export class GoogleComponent implements OnInit {
  constructor(private _router:Router,
              private _googleService:GoogleService) {
  }

  ngOnInit() {
    this._googleService.getGoogleUser().subscribe(
      data => this._router.navigate(['/dashboard'])
    );
  }
}