import { Component, OnInit } from '@angular/core';
import { EventService } from '../../shared/event.service';
import { EventModel } from '../../shared/event-model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
// ez jo pelda lehet smart es dumb componentre
  public events: EventModel[];

  constructor(private _eventService: EventService) {
    this.events = this._eventService.getAllEvents();
    console.log(this.events);
  }

  ngOnInit() {
  }

}
