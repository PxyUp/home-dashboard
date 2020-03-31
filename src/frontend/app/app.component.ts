import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { WebSocketService } from '../servicies/websocket.service';
import { Subject, from, BehaviorSubject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy {
  _list: { [key: string]: string} = {}

  _list$ = new BehaviorSubject([]);

  _destroyed = new Subject()

  list$ = this._list$.asObservable()

  obs$ = this.webSocketService.getStream()
  .pipe(
    tap((event) => {
      this._list[event.schedulerId] = event.value
      this._list$.next(Object.keys(this._list).map(e => ({
        id: e,
        value: this._list[e]
      })))
    }),
    takeUntil(this._destroyed),
  )

  constructor(private webSocketService: WebSocketService) {
    this.obs$.subscribe();
  }

  itemTrackBy(index: number, item) {
    return item.id;
  }

  ngOnDestroy() {
    this._destroyed.next();
  }


}
