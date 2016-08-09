import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {ErrorHandlerService} from '../shared/errorHandler.service';

@Injectable()
export class DashboardService {
  constructor(private http:Http,
              private _errorService:ErrorHandlerService) {
  }

  getData() {
    let jwt = localStorage.getItem('token') || '';
    let headers = new Headers({'Authorization': 'Bearer ' + jwt});
    let options = new RequestOptions({ headers: headers });
    return this.http.get('/api/dashboard', options)
      .map(res => res.json().data)
      .catch(this._errorService.handleError);
  }
}