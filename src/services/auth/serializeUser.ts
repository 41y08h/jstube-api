import jwt from "jsonwebtoken";
import IUser from "../../interfaces/IUser";

export default function serializeUser(user: IUser) {
  if (!user) return null;
  const token = jwt.sign(user.id.toString(), process.env.JWT_SECRET);
  return token;
}
