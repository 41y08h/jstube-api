import jwt from "jsonwebtoken";
import { usersTable } from "../../db/schema";
import { InferSelectModel } from "drizzle-orm";

export default function serializeUser(
  user: InferSelectModel<typeof usersTable>
) {
  if (!user) return null;
  const token = jwt.sign(user.id.toString(), process.env.JWT_SECRET);
  return token;
}
