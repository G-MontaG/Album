import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {ErrorHandlerService} from '../shared/errorHandler.service';

@Injectable()
export class ForgotService {
  constructor(private http:Http,
              private _errorService:ErrorHandlerService) {
  }

  postEmail(data:{email: string}) {
    let body = JSON.stringify({data});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post('/auth/forgot-password/email', body, options)
      .map(res => res.json())
      .catch(this._errorService.handleError);
  }

  postToken(data:{token: string}) {
    let body = JSON.stringify({data});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post('/auth/forgot-password/token', body, options)
      .map(res => res.json())
      .do((data) => localStorage.setItem("token", data.token))
      .catch(this._errorService.handleError);
  }

  postPassword(data:{password: string}) {
    let body = JSON.stringify({data});
    let jwt = localStorage.getItem('token') || '';
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt
    });
    let options = new RequestOptions({headers: headers});
    return this.http.post('/auth/forgot-password/new-password', body, options)
      .map(res => res.json())
      .do((data) => console.log(data))
      .catch(this._errorService.handleError);
  }
}