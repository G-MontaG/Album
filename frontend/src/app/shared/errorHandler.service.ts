import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Rx";

@Injectable()
export class ErrorHandlerService {
  constructor() {
  }

  public handleError(error: any):Observable<{}> {
    console.error(error);
    toastr.error(error.message);
    return Observable.throw(error || 'Server error');
  }
}