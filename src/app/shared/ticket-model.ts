import { EventModel } from './event-model';
import { UserModel } from './user-model';

export class TicketModel {
  id: number;
  date: string;
  artist: string;
  numberOfTickets: number;
  minimalBidPrice: number;
  bidStep: number;
  bidStartDate: string;
  bidEndDate: string;
  eventId: number;
  event?: EventModel;
  sellerUserId: number;
  seller?: UserModel;

  constructor(param?: TicketModel) {
    Object.assign(this, param);
  }
}
