import { Document } from "mongoose";

export default interface IUser extends Document {
  name: string;
  email: string;
  provider: { name: string; accountId: string };
}
