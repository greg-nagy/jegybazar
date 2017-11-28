import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { ChatFriendModel } from '../model/chat-friend.model';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Component({
  selector: 'app-chat-friend-row',
  templateUrl: './chat-friend-row.component.html',
  styleUrls: ['./chat-friend-row.component.css']
})
export class ChatFriendRowComponent implements OnChanges, AfterViewInit {
  @Input() friend: ChatFriendModel;
  @HostBinding('class.clearfix') classClearfix = true;
  @HostBinding('class.text-muted') classTextMuted = true;
  @HostBinding('class.focused') classFocused = false;
  @Output() select = new EventEmitter<ChatFriendModel>();
  @HostBinding('class.is-online') classIsOnline: boolean;
  @HostBinding('class.is-maybe-online') classIsMaybeOnline: boolean;
  @HostBinding('class.is-offline') classIsOffline: boolean;
  private maybeTimers$: Subscription[] = [];
  private focus$ = new Subject<boolean>();
  // 5 perc masodpercekben, unix timestamp szamolashoz amikor szamoljuk hogy valoban offline-e
  private maybeTimeInSeconds = 5 * 60 * 60;

  constructor(
    private cdr: ChangeDetectorRef,
  ) {
    this.focus$
      .subscribe(
        value => {
          if (value !== this.classTextMuted) {
            this.classTextMuted = value;
            this.classFocused = !value;

          }
        }
      );
  }

  ngAfterViewInit(): void {
    this.cdr.detach();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['friend'] != null) {
      const friend: ChatFriendModel = changes['friend'].currentValue;

      // ha van idozito akkor toroljuk
      if (this.maybeTimers$[friend.$id] != null) {
        this.maybeTimers$[friend.$id].unsubscribe();
        delete this.maybeTimers$[friend.$id];
      }

      if (friend.online === true) {
        this.setOnline();
      } else if (friend.online === false) {
        if ((moment().unix() - friend.lastOnline) > this.maybeTimeInSeconds) {
          // ha 5 percnel tovabb volt tavol akkor offline lesz
          this.setOffline();
        } else {
          this.setMaybeOnline();
          // adunk 5 percet a reconnectre, addig maybe lesz
          this.maybeTimers$[friend.$id] = new TimerObservable(this.maybeTimeInSeconds * 1000)
            .subscribe(
              () => this.setOffline()
            );
        }
      }
    }
  }

  @HostListener('mouseover', ['$event'])
  onHostFocus($event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.focus$.next(false);
  }

  @HostListener('mouseout', ['$event'])
  onHostBlur($event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.focus$.next(true);
  }

  @HostListener('click', ['$event'])
  onHostClick($event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.select.emit(this.friend);
  }

  private setMaybeOnline() {
    this.classIsOnline = false;
    this.classIsMaybeOnline = true;
    this.classIsOffline = false;
    this.cdr.markForCheck();
  }

  private setOffline() {
    this.classIsOnline = false;
    this.classIsMaybeOnline = false;
    this.classIsOffline = true;
    this.cdr.markForCheck();
  }

  private setOnline() {
    this.classIsOnline = true;
    this.classIsMaybeOnline = false;
    this.classIsOffline = false;
    this.cdr.markForCheck();
  }
}
