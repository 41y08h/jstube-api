import { model, Model, Schema } from "mongoose";
import IComment from "../interfaces/Comment";

const schema = new Schema(
  {
    _video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    _user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    editedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Comment: Model<IComment> = model("Comment", schema);

export default Comment;
