import Collection from '@app/realm/collection';

export interface IUserSchema {
  _id: string;
  username: string;
  password: string;
  email: string;
}

export default class UserSchema extends Collection<IUserSchema>({
  name: 'User',
}) {}
