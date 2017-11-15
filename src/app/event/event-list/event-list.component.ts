import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EventModel } from '../../shared/event-model';
import { EventService } from '../../shared/event.service';
import { UserService } from '../../shared/user.service';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventListComponent implements OnInit, AfterViewInit {
// ez jo pelda lehet smart es dumb componentre
  public eventsGrouppedBy3: EventModel[];
  public events$: Observable<EventModel[]>;
  public events: EventModel[];
  public eventsGrouppedBy3$: Observable<EventModel[][]>;
  @ViewChild('searchInput') searchInput: ElementRef;
  private filteredText$ = new BehaviorSubject<string>(null);

  constructor(
    private _eventService: EventService,
    public userService: UserService
  ) {
  }

  ngAfterViewInit(): void {
    console.log(this.searchInput);
    Observable.fromEvent(this.searchInput.nativeElement, 'keyup')
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
  }

  ngOnInit() {
    this.eventsGrouppedBy3$ = this._eventService.getAllEvents()
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
      )
      .map(data => {
        return data.reduce((acc: Array<any>, curr: EventModel, ind: number) => {
          if (ind % 3 === 0) {
            acc.push([]);
          }
          acc[acc.length - 1].push(curr);
          return acc;
        }, []);
      });

    // this._eventService.getAllEvents().subscribe(data => {
    //   this.eventsGrouppedBy3 = data.reduce((acc, curr: EventModel, ind: number) => {
    //     if (ind % 3 === 0) {
    //       acc.push([]);
    //     }
    //     acc[acc.length - 1].push(curr);
    //     return acc;
    //   }, []);
    // });

    // this._eventService.getAllEvents().subscribe(data => {
    //   this.events = data;
    // });
    // this.events$ = this._eventService.getAllEvents();
  }

  //   // ind!! [0,1,2,3,4,5,6,7,8] -- reduce --> [[0,1,2],[3,4,5],[6,7,8]]
  //   this.eventsGrouppedBy3 = this._eventService.getAllEvents()
  //     .reduce((acc, curr: EventModel, ind: number) => {
  //       if (ind % 3 === 0) {
  //         acc.push([]);
  //       }
  //       acc[acc.length - 1].push(curr);
  //       return acc;
  //     }, []);
  //   console.log(this.eventsGrouppedBy3);
  // }

}

