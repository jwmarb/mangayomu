import mongoose from 'mongoose';

export interface User {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, unique: true },
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});

export type UserDocument = User & mongoose.Document;
export type UserModel = mongoose.Model<UserDocument>;

const UserModel = mongoose.model('User', UserSchema, 'User');

export default ((mongoose.model as any).User as UserModel) || UserModel;
