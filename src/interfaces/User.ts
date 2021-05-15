import { Document } from "mongoose";

export default interface IUser extends Document {
  name: string;
  picture: string;
  email?: string;
  provider?: { name: string; accountId: string };
}
