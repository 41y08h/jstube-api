import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";

export default async function deserializeUser(token: string) {
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
