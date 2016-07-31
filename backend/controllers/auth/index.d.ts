import { RouterConfiguration, middlewareFunction } from "../../routerConfiguration";
export declare const authRouter: any;
export declare class AuthController {
    configurations: Array<RouterConfiguration>;
    checkToken: middlewareFunction;
    private login;
    private signupLocal;
    private verifyEmailToken;
    private forgotPasswordEmail;
    private forgotPasswordToken;
    private forgotPasswordNewPassword;
    private resetPassword;
    private facebookCode;
    private facebookToken;
    private facebookUser;
    private googleCode;
    private googleToken;
    private googleUser;
    constructor();
}
export declare const authController: AuthController;
