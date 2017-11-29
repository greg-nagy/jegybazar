import { Injectable } from '@angular/core';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { EventModel } from './event-model';
import { EventService } from '../event/event.service';
import { TicketModel } from './ticket-model';
import { UserModel } from './user-model';
import { UserService } from './user.service';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/first';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import 'rxjs/add/operator/do';
import { zip } from 'rxjs/observable/zip';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { combineLatest } from 'rxjs/observable/combineLatest';


@Injectable()
export class TicketService {

  constructor(
    private _eventService: EventService,
    private _userService: UserService,
    private afDb: AngularFireDatabase
  ) {
  }

  getAllTickets(): Observable<TicketModel[]> {
    return this.afDb.list('tickets')
      .map(ticketsArray => ticketsArray.map(ticket =>
        zip(
          of(new TicketModel(ticket)),
          this._eventService.getEventById(ticket.eventId),
          this._userService.getUserById(ticket.sellerUserId),
          (t: TicketModel, e: EventModel, u: UserModel) => {
            return {
              ...t,
              event: e,
              seller: u
            };
          })
      ))
      .switchMap(zipStreamArray => forkJoin(zipStreamArray));
  }

  create(ticket: TicketModel) {
    return fromPromise(this.afDb.list('tickets').push(ticket))
      .map(
        resp => resp.key
      )
      .do(
        ticketId => combineLatest(
          this._eventService.addTicket(ticket.eventId, ticketId),
          this._userService.addTicket(ticketId)
        )
      );
  }

  getOneOnce(id: string): Observable<TicketModel> {
    return this.getOne(id).first();
  }

  getOne(id: string): Observable<TicketModel> {
    return this.afDb.object(`tickets/${id}`)
      .flatMap(
        ticketFirebaseRemoteModel => {
          return combineLatest(
            of(new TicketModel(ticketFirebaseRemoteModel)),
            this._eventService.getEventById(ticketFirebaseRemoteModel.eventId),
            this._userService.getUserById(ticketFirebaseRemoteModel.sellerUserId),
            (t: TicketModel, e: EventModel, u: UserModel) => {
              return t.setEvent(e).setSeller(u);
            });
        }
      );
  }

  modify(ticket: TicketModel) {
    return fromPromise(this.afDb.object(`tickets/${ticket.id}`).update(ticket));
  }
}
