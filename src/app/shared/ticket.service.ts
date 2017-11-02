import { Injectable } from '@angular/core';
import { EventService } from './event.service';
import { TicketModel } from './ticket-model';
import { UserService } from './user.service';

@Injectable()
export class TicketService {
  private _tickets: TicketModel[];

  constructor(private _eventService: EventService,
              private  _userService: UserService) {
    this._tickets = this._getMockData();
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
    this._tickets = [
      ...this._tickets,
      {
        id: this._tickets.reduce((x, y) => x.id > y.id ? x : y).id + 1,
        ...param
      }
    ];
  }

  private _getMockData() {
    return [
      new TicketModel({
        'id': 1,
        'date': '2018-05-02',
        'numberOfTickets': 5,
        'minimalBidPrice': 2000,
        'bidStep': 500,
        'eventId': 4,
        'sellerUserId': 1
      }),
      new TicketModel({
        'id': 2,
        'date': '2018-10-12',
        'numberOfTickets': 4,
        'minimalBidPrice': 4000,
        'bidStep': 1000,
        'eventId': 1,
        'sellerUserId': 2
      }),
      new TicketModel({
        'id': 3,
        'date': '2018-10-02',
        'numberOfTickets': 7,
        'minimalBidPrice': 5000,
        'bidStep': 2000,
        'eventId': 2,
        'sellerUserId': 3
      }),
      new TicketModel({
        'id': 4,
        'date': '2019-06-04',
        'numberOfTickets': 5,
        'minimalBidPrice': 10000,
        'bidStep': 1000,
        'eventId': 5,
        'sellerUserId': 2
      }),
      new TicketModel({
        'id': 5,
        'date': '2018-11-06',
        'numberOfTickets': 2,
        'minimalBidPrice': 20000,
        'bidStep': 2000,
        'eventId': 7,
        'sellerUserId': 2
      }),
      new TicketModel({
        'id': 6,
        'date': '2019-11-06',
        'numberOfTickets': 1,
        'minimalBidPrice': 15000,
        'bidStep': 1500,
        'eventId': 9,
        'sellerUserId': 3
      })
    ];
  }
}
