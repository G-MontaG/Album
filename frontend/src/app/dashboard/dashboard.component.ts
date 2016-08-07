import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';

import {DashboardService} from './dashboard.service';

@Component({
  selector: 'dashboard',
  template: require('./dashboard.component.html'),
  directives: [ROUTER_DIRECTIVES],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {
  public response:Object;

  constructor(private _dashboardService:DashboardService) {

  }

  ngOnInit() {
    this._dashboardService.getData().subscribe(
      data => this.response = data
    );
  }
}