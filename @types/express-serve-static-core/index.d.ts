import { IUser } from '../../backend/src/api/v1/user/user.type';

export {};

declare global {
  namespace Express {
    class User extends IUser {}
  }
}
