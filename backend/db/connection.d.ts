declare const mongoose: any;
declare let connectionUrlParts: string[];
declare let connectionUrl: string;
declare const connectionOptions: {
    server: {
        auto_reconnect: boolean;
        socketOptions: {
            keepAlive: number;
            connectTimeoutMS: number;
            socketTimeoutMS: number;
        };
    };
};
declare function subscribeToMongoEvents(connection: any): void;
