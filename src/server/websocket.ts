const ws = require('ws');

export class WebSocket {
    private _ws =  new ws.Server({ port: 10002 });
    constructor() {

    }

    send(schedulerId: string, value: string) {
        this._ws.clients.forEach((client) => {
            if (client.readyState !== ws.OPEN) {
                return
            }
            client.send(Buffer.from(JSON.stringify({
                schedulerId,
                value
            })))
    })
    }
}