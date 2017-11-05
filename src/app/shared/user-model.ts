export class UserModel {
  id: string;
  name: string;
  email: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  profilePictureUrl: string;
  tickets: { [key: string]: string };

  constructor(param?: UserModel) {
    if (param) {
      Object.assign(this, param);
    }
  }
}
