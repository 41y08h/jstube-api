import jwt from "jsonwebtoken";
import User from "../../models/User";

export default async function deserializeUser(token: string) {
  try {
    const userId = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof userId === "string") {
      const user = await User.findById(userId);
      if (user) return user;
      return undefined;
    }
  } catch {
    return undefined;
  }
}
