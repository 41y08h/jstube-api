import jwt from "jsonwebtoken";
import db from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function deserializeUser(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
    };
    if (!decoded?.id) return undefined;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, parseInt(decoded.id))); // Ensure correct type if ID is numeric

    return user ?? undefined;
  } catch {
    return undefined;
  }
}
