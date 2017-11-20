import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { Observable } from 'rxjs/Observable';
import { ChatMessageModel } from './model/chat.model';
import { UserService } from '../shared/user.service';

@Injectable()
export class MockedChatService extends ChatService {

  constructor(userService: UserService) {
    super(userService);
  }

  addMessage(roomId: string, msg: string): Observable<boolean> {
    return super.addMessage(roomId, msg);
  }

  getRoomMessages(roomId: string): Observable<ChatMessageModel[]> {
    return super.getRoomMessages(roomId);
  }
}
