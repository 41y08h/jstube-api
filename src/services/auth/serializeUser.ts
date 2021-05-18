import { User } from ".prisma/client";
import jwt from "jsonwebtoken";

export default function serializeUser(user: User) {
  if (!user) return null;
  const token = jwt.sign(user.id.toString(), process.env.JWT_SECRET);
  return token;
}
