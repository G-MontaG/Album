import {Observable} from "rxjs";
export interface postLogin {
  email: string,
  password: string
}

export interface GoogleResponse {
  redirectUrl: string
}

export interface FacebookResponse {
  redirectUrl: string
}