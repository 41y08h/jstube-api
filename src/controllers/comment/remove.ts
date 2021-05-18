import { PrismaClient } from ".prisma/client";
import asyncHandler from "../../lib/asyncHandler";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const prisma = new PrismaClient();
  const status = await prisma.comment.deleteMany({
    where: { id: commentId, userId },
  });

  if (status.count) return res.sendStatus(200);
  throw res.clientError("Something went wrong", 422);
});
