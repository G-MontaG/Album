import mongoose = require('mongoose');
import Moment = moment.Moment;
export interface UserType extends mongoose.Document {
    _id: string;
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
        picture: {
            url: string;
            source: string;
        };
    };
    cryptPassword: Function;
    checkPassword: Function;
    createPassword: Function;
    findOne: Function;
    save: Function;
}
