import mongoose, { Model } from "mongoose";
import IRating from "../interfaces/Rating";

const schema = new mongoose.Schema({
  _video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
  },
  _comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
  itemType: {
    type: String,
    required: true,
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Rating: Model<IRating> = mongoose.model("Rating", schema);

export default Rating;
