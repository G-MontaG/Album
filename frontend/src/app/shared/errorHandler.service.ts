import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Rx";
import * as toastr from 'toastr';

@Injectable()
export class ErrorHandlerService {
  constructor() {
  }

  public handleError(error: any):Observable<{}> {
    let _error = error.json();
    console.error(_error);
    toastr.error(_error.message);
    return Observable.throw(_error || error || 'Server error');
  }
}