import { Injectable } from '@angular/core';
import { EventService } from './event.service';
import { TicketModel } from './ticket-model';
import { UserService } from './user.service';

@Injectable()
export class TicketService {
  private _tickets: TicketModel[];

  constructor(private _eventService: EventService,
              private  _userService: UserService) {
    // this._tickets = this._getMockData();
  }

  getAllTickets() {
    return this._tickets.map(ticket => {
      return {
        ...ticket,
        event: this._eventService.getEventById(ticket.eventId),
        seller: this._userService.getUserById(ticket.sellerUserId)
      };
    });
  }

  create(param: TicketModel) {
    // this._tickets = [
    //   ...this._tickets,
    //   new TicketModel({
    //     id: this._tickets.reduce((x, y) => x.id > y.id ? x : y).id + 1,
    //     ...param,
    //     event: this._eventService.getEventById(param.eventId),
    //     seller: this._userService.getUserById(param.sellerUserId)
    //   })
    // ];
    // console.log(this._tickets);
  }
}
