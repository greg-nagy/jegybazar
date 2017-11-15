import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { TicketModel } from '../../shared/ticket-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { bidMinimumValidator } from './bid.validators';
import { BidService } from '../../shared/bid.service';

@Component({
  selector: 'app-bid-form',
  templateUrl: './bid-form.component.html',
  styleUrls: ['./bid-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BidFormComponent implements OnInit, OnChanges {
  @Input() ticket: TicketModel;
  @Output() bid = new EventEmitter<void>();
  displayBidStep = true;
  form: FormGroup;
  submitted = false;
  submitSuccessAlert = false;
  submitErrorAlert = false;
  disabled = false;

  constructor(
    private fb: FormBuilder,
    private bidService: BidService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticket'] != null
      && !changes['ticket'].isFirstChange()
      && changes['ticket'].currentValue != null) {
      this.disabled = false;
      this.form.reset({ bid: null });
      this.form.get('bid').enable();
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        bid: [
          null,
          Validators.compose(
            [
              Validators.required,
              bidMinimumValidator(() => {return this.ticket; })
            ]
          )
        ]
      }
    );
  }

  onBidWithBidStep() {
    this.toBid(this.ticket.currentBid + this.ticket.bidStep)
      .subscribe(
        () => {
          // notification user
          this.submitSuccessAlert = true;
          this.bid.emit();
          this.form.get('bid').enable();
        },
        err => {
          console.error(err);
          this.submitErrorAlert = true;
        }
      );
  }

  displayBidWithStep($event: Event) {
    $event.preventDefault();

    this.displayBidStep = false;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      this.toBid(this.form.value['bid'])
        .subscribe(
          () => {
            this.submitted = false;
            // notification user
            this.submitSuccessAlert = true;
            this.bid.emit();
          },
          err => {
            console.error(err);
            this.submitErrorAlert = true;
          }
        );
    }
    console.log('Licitaltak');
    console.log(this.form.value);
    console.log(this.form.valid);
  }

  toBid(value: number) {
    this.submitSuccessAlert = false;
    this.submitErrorAlert = false;
    this.form.get('bid').disable();
    this.disabled = true;

    return this.bidService.bid(this.ticket.id, value);
  }
}
