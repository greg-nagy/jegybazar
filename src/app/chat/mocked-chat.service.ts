import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { Observable } from 'rxjs/Observable';
import { ChatMessageModel } from './model/chat.model';
import { UserService } from '../shared/user.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import * as moment from 'moment';

export const MockedChatDatas = {
  mockedRoomId: '-Ky0HolLJBH3Q5uVHWZf',
  mockedUserId: 'mBUswvbahhRRDVfbfACIEgx3FKK2',
  mockedUserName: 'Nagy Gergő',
  mockedUserPictureUrl: 'https://cmeimg-a.akamaihd.net/640/clsd/getty/b96e82c973184dc8945a64a19e8e2e2e'
};

@Injectable()
export class MockedChatService extends ChatService {
  private rooms$ = new BehaviorSubject<BehaviorSubject<ChatMessageModel[]>[]>([]);

  constructor(userService: UserService) {
    super(userService);
    // fill mocked messages
    const mockedMessages = [];
    for (let i = 0; i < 10; i++) {
      mockedMessages.push({
        $id: null,
        msg: `Test messages: ${i}`,
        userId: MockedChatDatas.mockedUserId,
        userName: MockedChatDatas.mockedUserName,
        userPictureUrl: MockedChatDatas.mockedUserPictureUrl,
        created: moment().unix()
      });
    }

    const currentRooms = this.rooms$.getValue();
    currentRooms[MockedChatDatas.mockedRoomId] = new BehaviorSubject<ChatMessageModel[]>(mockedMessages);
    this.rooms$.next(currentRooms);
  }

  addMessage(roomId: string, msg: string): Observable<boolean> {
    const rooms = this.rooms$.getValue();
    const roomMessages = rooms[roomId].getValue();

    return this.userService.getCurrentUser()
      .delay(300)
      .switchMap(
        user => {
          roomMessages.push(
            new ChatMessageModel({
              $id: null,
              'msg': msg,
              userId: MockedChatDatas.mockedUserId,
              userName: MockedChatDatas.mockedUserName,
              userPictureUrl: MockedChatDatas.mockedUserPictureUrl,
              created: moment().unix()
            })
          );
          rooms[roomId].next(roomMessages);

          return Observable.of(true);
        }
      );
  }

  getRoomMessages(roomId: string): Observable<ChatMessageModel[]> {
    const rooms = this.rooms$.getValue();
    if (rooms[roomId] == null) {
      // First init room
      rooms[roomId] = new BehaviorSubject<ChatMessageModel[]>([]);
      this.rooms$.next(rooms);
    }
    return rooms[roomId].asObservable();
  }
}
