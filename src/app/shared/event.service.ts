import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { EventModel } from './event-model';

@Injectable()
export class EventService {

  constructor(private _http: HttpClient) {
  }

  getAllEvents(): Observable<EventModel[]> {
    return this._http.get(`${environment.firebase.baseUrl}/events.json`)
      .map(data => Object.values(data).map(evm => new EventModel(evm)));
  }

  getEventById(id: number) {
    return this._http.get<EventModel>(`${environment.firebase.baseUrl}/events/${id}.json`);
  }

  update(param: EventModel) {
    // this._events = this._events.map(ev => {
    //   // if (ev.id === param.id) {
    //   //   return {...param};
    //   // } else {
    //   //   return ev;
    //   // }
    //   return ev.id === param.id ? {...param} : ev;
    // });
  }

  create(param: EventModel) {
    // this._events = [
    //   ...this._events,
    //   {
    //     id: this._getMaxId() + 1,
    //     ...param
    //   }
    // ];
  }
}

