import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {ErrorHandlerService} from '../shared/errorHandler.service';

@Injectable()
export class ResetService {
  constructor(private http:Http,
              private _errorService:ErrorHandlerService) {
  }

  postResetPassword(data:Object) {
    let body = JSON.stringify({data});
    let jwt = localStorage.getItem('token') || '';
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt
    });
    let options = new RequestOptions({headers: headers});
    return this.http.post('/auth/reset-password', body, options)
      .map(res => res.json())
      .do((data) => console.log(data))
      .catch(this._errorService.handleError);
  }
}