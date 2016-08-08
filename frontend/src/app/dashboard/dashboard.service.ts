import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import * as toastr from 'toastr';

@Injectable()
export class DashboardService {
  constructor(private http:Http) {
  }

  getData() {
    let jwt = localStorage.getItem('token') || '';
    let headers = new Headers({'Authorization': 'Bearer ' + jwt});
    let options = new RequestOptions({ headers: headers });
    return this.http.get('/api/dashboard', options)
      .map(res => res.json().data)
      .catch(this.handleError);
  }

  private handleError(error:any) {
    console.error(error);
    toastr.error(error.message);
    return Observable.throw(error || 'Server error');
  }
}