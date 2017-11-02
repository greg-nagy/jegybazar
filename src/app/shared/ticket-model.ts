import { EventModel } from './event-model';
import { UserModel } from './user-model';

export class TicketModel {
  id?: number;
  date: string;
  numberOfTickets: number;
  minimalBidPrice: number;
  bidStep: number;
  eventId: number;
  event?: EventModel;
  sellerUserId: number;
  seller?: UserModel;

  constructor(param?: TicketModel) {
    Object.assign(this, param);
  }

  static get emptyTicket(): TicketModel {
    return {
      date: '',
      numberOfTickets: 0,
      minimalBidPrice: 0,
      bidStep: 0,
      eventId: 0,
      sellerUserId: 0
    };
  }
}
