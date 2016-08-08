import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import * as toastr from 'toastr';

@Injectable()
export class ResetService {
  constructor(private http:Http) {
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
      .catch(this.handleError);
  }

  private handleError(error:any) {
    console.error(error);
    toastr.error(error.message);
    return Observable.throw(error || 'Server error');
  }
}