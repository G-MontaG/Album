import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {postLogin, GoogleResponse, FacebookResponse} from "./login.model";
import {ErrorHandlerService} from '../shared/errorHandler.service';

@Injectable()
export class LoginService {
  constructor(private http:Http,
              private _errorService:ErrorHandlerService) {
  }

  postLogin(data:postLogin) {
    let body = JSON.stringify({data});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post('/auth/login', body, options)
      .map(res => res.json())
      .do((data) => localStorage.setItem("token", data.token))
      .catch(this._errorService.handleError);
  }

  getGoogle():Observable<GoogleResponse> {
    return this.http.get('/auth/google-auth')
      .map(res => res.json())
      .catch(this._errorService.handleError);
  }

  getFacebook():Observable<FacebookResponse> {
    return this.http.get('/auth/facebook-auth')
      .map(res => res.json())
      .catch(this._errorService.handleError);
  }
}