import mongoose, { Model } from "mongoose";
import ISubscriber from "../interfaces/Subscriber";

const schema = new mongoose.Schema(
  {
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    _channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Subscriber: Model<ISubscriber> = mongoose.model("Subscriber", schema);

export default Subscriber;
