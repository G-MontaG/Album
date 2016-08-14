export interface postSignupLocalData {
  profile: {
    firstname:string,
    lastname:string,
  }
  email:string,
  password:string
}

export interface GoogleResponse {
  redirectUrl: string
}

export interface FacebookResponse {
  redirectUrl: string
}