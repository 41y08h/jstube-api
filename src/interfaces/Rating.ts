import { Document } from "mongoose";
import IVideo from "./Video";
import IUser from "./User";
import RatingStatus from "../types/RatingStatus";

export default interface IRating extends Document {
  _video: String | IVideo;
  _user: String | IUser;
  status: RatingStatus;
}
