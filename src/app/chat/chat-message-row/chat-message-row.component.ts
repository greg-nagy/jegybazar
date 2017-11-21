import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChatMessageModel } from '../model/chat.model';

@Component({
  selector: 'app-chat-message-row',
  templateUrl: './chat-message-row.component.html',
  styleUrls: ['./chat-message-row.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageRowComponent {
  @Input() msg: ChatMessageModel;
}
