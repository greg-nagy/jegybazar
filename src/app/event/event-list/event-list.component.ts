import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EventModel } from '../../shared/event-model';
import { EventService } from '../event.service';
import { UserService } from '../../shared/user.service';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
})
export class EventListComponent implements OnInit, OnDestroy, AfterViewInit {
  public events: EventModel[];
  isLoggedIn: boolean;
  @ViewChild('searchInput') searchInput: ElementRef;
  private filteredText$ = new BehaviorSubject<string>(null);
  private eventsSubscription: Subscription;
  private isLoggedInSubcription: Subscription;

  constructor(
    private _eventService: EventService,
    userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoggedInSubcription = userService.isLoggedIn$.subscribe(
      isLoggedIn => this.isLoggedIn = isLoggedIn
    );
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
    this.isLoggedInSubcription.unsubscribe();
  }

  ngAfterViewInit(): void {
    console.log(this.searchInput);
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .delay(600)
      .map(
        (event: Event) => {
          return (event.srcElement as HTMLInputElement).value;
        }
      )
      .distinctUntilChanged()
      .subscribe(
        text => {
          if (text.length === 0) {
            text = null;
          }
          this.filteredText$.next(text);
        }
      );
    this.cdr.detach();
  }

  ngOnInit() {
    this.eventsSubscription = this._eventService.getAllEvents()
      .flatMap(
        events => {
          return this.filteredText$.map(
            filterText => {
              if (filterText === null) {
                return events;
              } else {
                return events.filter(
                  event => {
                    return event.name.toLowerCase().indexOf(filterText.toLowerCase()) > -1;
                  }
                );
              }
            }
          );
        }
      ).subscribe(
        events => {
          this.events = events;
          this.cdr.detectChanges();
        }
      );
  }
}

