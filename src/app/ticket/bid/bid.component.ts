import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../shared/ticket.service';
import { TicketModel } from '../../shared/ticket-model';

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.css']
})
export class BidComponent implements OnInit {
  ticket: TicketModel;

  constructor(private ticketService: TicketService) { }

  ngOnInit() {
    const id = '-Ky0HolLJBH3Q5uVHWZf';
    this.ticketService.getOne(id).subscribe(
      ticket => this.ticket = ticket
    );
  }
}
