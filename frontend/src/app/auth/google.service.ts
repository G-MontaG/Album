import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import * as toastr from 'toastr';

@Injectable()
export class GoogleService {
  constructor(private http:Http) {
  }

  getGoogleUser() {
    return this.http.get('/auth/google-auth/user')
      .map(res => res.json())
      .do((data) => localStorage.setItem('token', data.token))
      .catch(this.handleError);
  }

  private handleError(error:any) {
    console.error(error);
    toastr.error(error.message);
    return Observable.throw(error || 'Server error');
  }
}