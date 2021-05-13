import { Document } from "mongoose";
import IUser from "./User";

export default interface IVideo extends Document {
  title: String;
  description: String;
  source: String;
  thumbnail: String;
  duration: Number;
  views: Number;
  _user: String | IUser;
}
