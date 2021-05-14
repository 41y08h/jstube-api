import { Document } from "mongoose";
import IUser from "./User";
import IVideo from "./Video";

export default interface IComment extends Document {
  _video: IVideo | string;
  _user: IUser | string;
  text: string;
  createdAt: Date;
  updatedAt: Date | undefined;
}
