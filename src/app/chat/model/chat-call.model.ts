import { ChatFriendModel } from './chat-friend.model';

export class ChatCallModel {
  $id: string;
  roomId: string;
  friend: ChatFriendModel;

  constructor(data?: ChatCallModel) {
    if (data != null) {
      Object.assign(this, data);

      const $idPropertyDescriptior = Object.getOwnPropertyDescriptor(this, '$id');
      $idPropertyDescriptior.enumerable = false;
      Object.defineProperty(this, '$id', $idPropertyDescriptior);
    }
  }
}
