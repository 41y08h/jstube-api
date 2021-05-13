import mongoose, { Model } from "mongoose";
import IUser from "../interfaces/User";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    picture: { type: String, required: true },
    provider: { name: String, accountId: String },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model("User", schema);

export default User;
