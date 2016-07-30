import { routerConfiguration, handlerFunction } from "../routerConfiguration";
export declare const authRouter: any;
export declare class AuthController {
    configurations: Array<routerConfiguration>;
    login: handlerFunction;
    constructor(configurations: Array<routerConfiguration>, login: handlerFunction);
}
