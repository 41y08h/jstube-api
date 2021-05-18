import { PrismaClient } from ".prisma/client";
import jwt from "jsonwebtoken";

export default async function deserializeUser(token: string) {
  const prisma = new PrismaClient();
  try {
    const userId = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof userId === "string") {
      const user = await prisma.user.findFirst({
        where: { id: parseInt(userId) },
      });
      if (user) return user;
      return undefined;
    }
  } catch {
    return undefined;
  }
}
