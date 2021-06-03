import jwt from "jsonwebtoken";
import db from "../../lib/db";
import IUser from "../../interfaces/IUser";

export default async function deserializeUser(token: string) {
  try {
    const userId = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof userId === "string") {
      const {
        rows: [user],
      } = await db.query<IUser>(`select * from "User" where id = $1`, [userId]);
      if (user) return user;
      return undefined;
    }
  } catch {
    return undefined;
  }
}
