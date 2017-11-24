import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EventModel } from '../../shared/event-model';

@Component({
  selector: 'app-eventcard',
  templateUrl: './eventcard.component.html',
  styleUrls: ['./eventcard.component.css']
})
export class EventcardComponent implements AfterViewInit, OnChanges {
  @Input() esemeny: EventModel;
  @Input() nextLabel = 'Tovább';

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nextLabel'] != null
      && changes['nextLabel'].isFirstChange()) {
      this.cdr.detectChanges();
    } else if (changes['esemeny'] != null) {
      const prev: EventModel = changes['esemeny'].previousValue;
      const current: EventModel = changes['esemeny'].currentValue;

      if (prev == null || current == null) {
        this.cdr.detectChanges();
      } else if (prev.pictureURL !== current.pictureURL) {
        this.cdr.detectChanges();
      } else if (prev.name !== current.name) {
        this.cdr.detectChanges();
      } else if (prev.description !== current.description) {
        this.cdr.detectChanges();
      } else if (prev.date !== current.date) {
        this.cdr.detectChanges();
      } else if (prev.$id !== current.$id) {
        this.cdr.detectChanges();
      }
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detach();
  }

}
