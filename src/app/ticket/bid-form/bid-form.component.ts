import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TicketModel } from '../../shared/ticket-model';

@Component({
  selector: 'app-bid-form',
  templateUrl: './bid-form.component.html',
  styleUrls: ['./bid-form.component.css']
})
export class BidFormComponent {
  @Input() ticket: TicketModel;
  @Output() bidWithBidStep = new EventEmitter<void>();

  onBidWithBidStep() {
    this.bidWithBidStep.emit();
  }
}
