import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {DashboardService} from './dashboard.service';

@Component({
  selector: 'dashboard',
  template: require('./dashboard.component.html'),
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {
  public response: Object;

  constructor(private _dashboardService: DashboardService,
              private _router: Router) {

  }

  ngOnInit() {
    this._dashboardService.getData().subscribe(
      data => this.response = data
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/']);
  }
}