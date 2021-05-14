import { Document } from "mongoose";
import IUser from "./User";

export default interface ISubscriber extends Document {
  _user: String | IUser;
  _channel: String | IUser;
}
