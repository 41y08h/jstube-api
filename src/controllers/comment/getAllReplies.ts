import { PrismaClient } from ".prisma/client";
import asyncHandler from "../../lib/asyncHandler";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);

  const prisma = new PrismaClient();
  const replies = await prisma.comment.findMany({
    where: { baseCommentId: commentId },
  });
  res.json(replies);
});
