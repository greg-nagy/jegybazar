import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { TicketModel } from '../../shared/ticket-model';

@Component({
  selector: 'app-bidding-card',
  templateUrl: './bidding-card.component.html',
  styleUrls: ['./bidding-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BiddingCardComponent implements OnChanges {
  @Input() ticket: TicketModel;
  @Input() isLoggedIn: Boolean;
  @Output() bid = new EventEmitter<void>();
  loading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticket'] != null
      && !changes['ticket'].isFirstChange()
      && changes['ticket'].currentValue != null) {
      this.loading = false;
    }
  }

  onBidWithBidStep() {
    this.loading = true;
    this.bid.emit();
  }
}
