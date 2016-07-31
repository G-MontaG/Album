import Moment = moment.Moment;
export interface UserType {
    _id: any;
    email: string;
    emailConfirmed: boolean;
    password: string;
    salt: string;
    emailVerifyToken?: {
        value: string;
        exp: Moment;
    };
    passwordResetToken?: {
        value: string;
        exp: Moment;
    };
    forgotPasswordToken?: {
        value: string;
        exp: Moment;
    };
    google: Object;
    facebook: Object;
    profile: {
        firstname: string;
        lastname: string;
        gender: string;
        language: string;
        picture?: {
            url: string;
            source: string;
        };
    };
}
