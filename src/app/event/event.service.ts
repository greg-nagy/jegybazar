import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { EventModel } from '../shared/event-model';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { fromPromise } from 'rxjs/observable/fromPromise';

@Injectable()
export class EventService {

  constructor(private afDb: AngularFireDatabase) {
  }

  getAllEvents(): Observable<EventModel[]> {
    return this.afDb.list('events')
      .map(
        events =>
          events.map(event => new EventModel(Object.assign(event, { $id: event.$key })))
      );
  }

  getEventById(id: string) {
    return this.afDb.object(`events/${id}`);
  }

  save(param: EventModel) {
    if (param.$id) {
      // update
      return fromPromise(this.afDb.object(`events/${param.$id}`).update(param));
    } else {
      // create
      return fromPromise(this.afDb.object(`events/${param.$id}`).set(param));
    }
  }

  // TODO: itt kitalalni, hogy hogyan akarjuk kezelni a fuggosegeket es aszerint implementalni
  delete(event: EventModel) {
    return fromPromise(this.afDb.object(`events/${event.$id}`).remove());
  }

  addTicket(eventId: string, ticketId: string): Observable<string> {
    return fromPromise(this.afDb.list(`events/${eventId}/tickets`).push(ticketId));
  }
}

