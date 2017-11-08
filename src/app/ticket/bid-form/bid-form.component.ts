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
  displayBidStep = true;

  onBidWithBidStep() {
    this.bidWithBidStep.emit();
  }

  displayBidWithStep($event: Event) {
    $event.preventDefault();

    this.displayBidStep = false;
  }
}
