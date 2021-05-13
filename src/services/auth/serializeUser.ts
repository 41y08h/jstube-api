import IUser from "../../interfaces/User";
import jwt from "jsonwebtoken";

export default function serializeUser(user?: IUser) {
  if (!user) return null;
  const token = jwt.sign(user.id, process.env.JWT_SECRET);
  return token;
}
