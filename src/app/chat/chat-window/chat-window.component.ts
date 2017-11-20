import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/skip';
import { environment } from '../../../environments/environment';
import { MockedChatDatas } from '../mocked-chat.service';
import { Observable } from 'rxjs/Observable';
import { ChatMessageModel } from '../model/chat.model';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {
  @Input() roomId = environment.production ? null : MockedChatDatas.mockedRoomId;
  form: FormGroup;
  invalidChatMessageInput = false;
  @ViewChild('chatMessageInput') chatMessageInput: ElementRef;
  chatMessage$: Observable<ChatMessageModel[]>;

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService
  ) {
  }

  ngOnInit() {
    this.chatMessage$ = this.chatService.getRoomMessages(this.roomId);

    this.form = this.fb.group({
      'chat-message': [null, Validators.required]
    });

    this.form.get('chat-message')
      .valueChanges
      .distinctUntilChanged(
        msg => {
          return !(msg.length > 0 && this.invalidChatMessageInput);
        }
      )
      .skip(1)
      .subscribe(
        msg => this.invalidChatMessageInput = false
      );
  }

  sendMessage() {
    if (this.form.invalid) {
      this.invalidChatMessageInput = true;
      this.chatMessageInput.nativeElement.focus();
    } else {
      this.chatService.addMessage(this.roomId, this.form.value['chat-message'])
        .subscribe(
          resp => {
            if (resp) {
              this.form.reset({ 'chat-message': null });
              this.chatMessageInput.nativeElement.focus();
            } else {
              alert('Hiba a chat üzenet küldése közben');
            }
          }
        );
    }
  }
}
