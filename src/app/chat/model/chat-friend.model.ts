export class ChatFriendModel {
  $id: string;
  name: string;
  profilePictureUrl: string;

  constructor(data?: ChatFriendModel) {
    if (data != null) {
      Object.assign(this, data);

      const $idPropertyDescriptior = Object.getOwnPropertyDescriptor(this, '$id');
      $idPropertyDescriptior.enumerable = false;
      Object.defineProperty(this, '$id', $idPropertyDescriptior);
    }
  }
}
