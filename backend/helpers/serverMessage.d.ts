import express = require('express');
export declare class ServerMessage {
    constructor();
    static error(res: express.Response, status: number, message: string): void;
    static message(res: express.Response, status: number, data: any): void;
    static data(res: express.Response, status: number, data: any): void;
}
