import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatFriendModel } from '../model/chat-friend.model';
import { Observable } from 'rxjs/Observable';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-friend-list',
  templateUrl: './chat-friend-list.component.html',
  styleUrls: ['./chat-friend-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatFriendListComponent implements OnInit {
  friendList$: Observable<ChatFriendModel[]>;
  @Output() select = new EventEmitter<ChatFriendModel>();

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.friendList$ = this.chatService.getMyFriendList();
  }

  onSelectFriend(friend: ChatFriendModel) {
    this.select.emit(friend);
  }
}
