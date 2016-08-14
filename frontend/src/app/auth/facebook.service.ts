import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {ErrorHandlerService} from '../shared/errorHandler.service';

@Injectable()
export class FacebookService {
  constructor(private http:Http,
              private _errorService:ErrorHandlerService) {
  }

  getFacebookUser() {
    return this.http.get('/auth/facebook-auth/user')
      .map(res => res.json())
      .do((data) => localStorage.setItem('token', data.token))
      .catch(this._errorService.handleError);
  }
}