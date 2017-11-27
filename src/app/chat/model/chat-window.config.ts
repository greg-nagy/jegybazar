import { ChatFriendModel } from './chat-friend.model';

export interface ChatWindowConfig {
  id?: string;
  title: string;
  roomId: string;
  closeable?: boolean;
  friend: ChatFriendModel;
}
