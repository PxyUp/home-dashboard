import grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';
import { WebSocket } from './websocket'

const PROTO_PATH = './proto/squzy-proto/proto/v1/storage.proto';
const protoDefinition = protoLoader.loadSync(PROTO_PATH, {});

const {
    squzy: {
        // @ts-ignore
        storage: {
            v1: {
                service: {
                    Logger: {
                        service: squzyLogger,
                    }
                }
            },
        },
    },
} = grpc.loadPackageDefinition(protoDefinition);

export class Server {
    private _server = new grpc.Server()
    
    constructor(private ws: WebSocket) {
        this._server.addService(squzyLogger, {
            sendLogMessage: (call: grpc.ServerUnaryCall<any>, response) => {
                const {
                    log: {
                        value: {
                            stringValue,
                        }
                    },
                    schedulerId,
                } = call.request;

                this.ws.send(schedulerId, stringValue)

                response(null, true)
            }
        })
        this._server.bind('127.0.0.1:10001', grpc.ServerCredentials.createInsecure())
    }

    start() {
        return this._server.start()
    }
 }
