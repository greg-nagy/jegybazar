import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from './chat.service';
import { MockedChatService } from './mocked-chat.service';
import { UserService } from '../shared/user.service';
import { environment } from '../../environments/environment';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { ChatMessageRowComponent } from './chat-message-row/chat-message-row.component';
import { ChatMessageSendFormComponent } from './chat-message-send-form/chat-message-send-form.component';
import { MomentModule } from 'angular2-moment';
import { ChatFriendListComponent } from './chat-friend-list/chat-friend-list.component';
import { ChatComponent } from './chat/chat.component';
import { ChatFriendRowComponent } from './chat-friend-row/chat-friend-row.component';

export const chatServiceProvideFactoryFn =
  (userService: UserService) => {
    return environment.production ?
      new ChatService(userService) :
      new MockedChatService(userService);
  };

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    MomentModule
  ],
  declarations: [
    ChatWindowComponent,
    ChatMessageRowComponent,
    ChatMessageSendFormComponent,
    ChatComponent,
    ChatFriendListComponent,
    ChatFriendRowComponent
  ],
  exports: [
    ChatComponent
  ]
})
export class ChatModule {
}
