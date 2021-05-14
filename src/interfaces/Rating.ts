import { Document } from "mongoose";
import IVideo from "./Video";
import IUser from "./User";
import RatingStatus from "../types/RatingStatus";
import IComment from "./Comment";
import RatingItemType from "../types/RatingItemType";

export default interface IRating extends Document {
  _video?: String | IVideo;
  _comment?: String | IComment;
  _user: String | IUser;
  itemType: RatingItemType;
  status: RatingStatus;
}
