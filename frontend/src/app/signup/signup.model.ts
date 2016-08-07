export interface postSignupLocalData {
  profile: {
    firstname:string,
    lastname:string,
  }
  email:string,
  password:string
}

export interface getGoogle {
  redirectUrl: string
}

export interface getFacebook {
  redirectUrl: string
}