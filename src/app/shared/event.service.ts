import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
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

  getEventById(id: string) {
    return this._http.get<EventModel>(`${environment.firebase.baseUrl}/events/${id}.json`);
  }

  save(param: EventModel) {
    console.log(param);
    if (param.id) { // udpate ag
      return this._http.put(`${environment.firebase.baseUrl}/events/${param.id}.json`, param);
    } else { // create ag
      return this._http.post(`${environment.firebase.baseUrl}/events.json`, param)
        .map((fbPostReturn: { name: string }) => fbPostReturn.name)
        .switchMap(fbId => this._http.patch(
          `${environment.firebase.baseUrl}/events/${fbId}.json`,
          {id: fbId}
        ));
    }
  }

  // TODO: itt kitalalni, hogy hogyan akarjuk kezelni a fuggosegeket es aszerint implementalni
  delete(param: EventModel) {
    return this._http.delete(`${environment.firebase.baseUrl}/events/${param.id}.json`);
  }

  addTicket(eventId: string, ticketId: string): Observable<string> {
    return this._http.patch(
      `${environment.firebase.baseUrl}/events/${eventId}/tickets.json`,
      {[ticketId]: true}
    )
      .map(rel => Object.keys(rel)[0]);
  }
}

