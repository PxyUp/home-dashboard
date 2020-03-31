import { Injectable } from '@angular/core';
import { webSocket } from "rxjs/webSocket";
import { switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private _obs = webSocket({
      url: 'ws://localhost:10002',
      protocol: 'json',
      binaryType: 'blob',
      deserializer: (msg) => {
        return msg.data.text().then(e => JSON.parse(e))
      }
    }).asObservable()
  constructor() { }

  getStream() {
      return this._obs.pipe(switchMap((promise: Promise<{ schedulerId: string, value: string}>) => {
          return from(promise)
      }));
  }

}