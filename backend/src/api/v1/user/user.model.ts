import mongoose from 'mongoose';
import { IUserDocument, IUserModel } from './user.type';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    maxActions: {
      type: Number,
      default: 10,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.static(
  'isUsernameTaken',
  async function (username: string, id?: string) {
    const user = await this.findOne({ username, _id: { $ne: id } });
    return !!user;
  },
);

userSchema.static('isEmailTaken', async function (email: string, id?: string) {
  const user = await this.findOne({
    email: email.toLowerCase(),
    _id: { $ne: id },
  });
  return !!user;
});

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User;
