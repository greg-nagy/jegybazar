import { Injectable, Optional } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Observable } from 'rxjs/Observable';
import { ChatMessageModel } from './model/chat.model';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import 'rxjs/add/operator/switchMap';
import * as moment from 'moment';
import 'rxjs/add/operator/map';
import { ChatFriendModel } from './model/chat-friend.model';
import 'rxjs/add/operator/first';
import { ChatCallModel } from './model/chat-call.model';

@Injectable()
export class ChatService {
  private static PATH = 'chat';

  constructor(
    protected userService: UserService,
    @Optional() protected afDb?: AngularFireDatabase
  ) { }

  addMessage(roomId: string, msg: string): Observable<boolean> {
    return this.userService.getCurrentUser()
      .switchMap(
        user => {
          return new Observable<boolean>(
            observer => {
              const room = this.afDb.list(`${ChatService.PATH}/${roomId}`);
              room.push(
                new ChatMessageModel({
                  $id: null,
                  'msg': msg,
                  userId: user.id,
                  userName: user.name,
                  userPictureUrl: user.profilePictureUrl,
                  created: moment().unix()
                })
              ).then(
                () => {
                  observer.next(true);
                  observer.complete();
                },
                error => {
                  observer.next(false);
                  observer.error(error);
                  observer.complete();
                }
              );
            }
          );
        }
      );
  }

  getRoomMessages(roomId: string): Observable<ChatMessageModel[]> {
    return this.afDb.list(`${ChatService.PATH}/${roomId}`)
      .map(
        list =>
          list.map(
            chatMessage =>
              new ChatMessageModel(Object.assign(chatMessage, { $id: chatMessage.$key }))
          )
      );
  }

  getMyFriendList(): Observable<ChatFriendModel[]> {
    return this.userService.getCurrentUser()
      .first()
      .switchMap(
        user => {
          return this.afDb.list(`chat_friend_list/${user.id}`)
            .map(
              friends =>
                friends.map(
                  friend => new ChatFriendModel(Object.assign(friend, { $id: friend.$key }))
                )
            );
        }
      );
  }

  addChatWait(roomId: string, friend: ChatFriendModel) {
    this.userService.getCurrentUser().first()
      .subscribe(
        user => {
          this.afDb.object(`chat_wait/${friend.$id}/${user.id}`)
            .set({
              'roomId': roomId,
              'friend': new ChatFriendModel({
                $id: user.id,
                name: user.name, profilePictureUrl: user.profilePictureUrl,
                online: true,
                lastOnline: null
              })
            });
        }
      );
  }

  getChatCallWatcher(): Observable<ChatCallModel[]> {
    return this.userService.getCurrentUser().first()
      .switchMap(user => {
        return this.afDb.list(`chat_wait/${user.id}`)
          .map(
            calls =>
              calls.map(
                call =>
                  new ChatCallModel(Object.assign(
                    call,
                    {
                      $id: call.$key, friend: new ChatFriendModel(Object.assign(call.friend, { $id: call.$key }))
                    }
                  ))
              )
          );
      });
  }

  removeWatcher(id: string) {
    this.userService.getCurrentUser()
      .first().delay(1000).subscribe(
      user => {
        this.afDb.object(`chat_wait/${user.id}/${id}`).remove().then();
      }
    )
  }
}
