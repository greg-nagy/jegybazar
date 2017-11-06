import { EventModel } from './event-model';
import { UserModel } from './user-model';

export class TicketModel {
  id: string;
  numberOfTickets: number;
  minimalBidPrice: number;
  bidStep: number;
  eventId: string;
  event: EventModel;
  sellerUserId: string;
  seller: UserModel;
  currentBid: number;
  bidCounter: number;
  bidEndDate: number;
  details: string;

  constructor(param?: TicketModel) {
    Object.assign(this, param);
  }
}
