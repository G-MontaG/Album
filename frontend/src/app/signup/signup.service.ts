import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import * as toastr from 'toastr';

import {postSignupLocalData, getGoogle, getFacebook} from "./signup.model";

@Injectable()
export class SignupService {
  constructor(private http:Http) {

  }

  postSignupLocal(data:postSignupLocalData) {
    let body = JSON.stringify({data});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post('/auth/signup', body, options)
      .map(res => res.json())
      .do((data) => localStorage.setItem("token", data.token))
      .catch(this.handleError);
  }

  getGoogle():Observable<getGoogle> {
    return this.http.get('/auth/google-auth')
      .map(res => res.json())
      .catch(this.handleError);
  }

  getFacebook():Observable<getFacebook> {
    return this.http.get('/auth/facebook-auth')
      .map(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error:any) {
    console.error(error);
    toastr.error(error.message);
    return Observable.throw(error || 'Server error');
  }
}