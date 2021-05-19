import asyncHandler from "../../lib/asyncHandler";
import prisma from "../../lib/prisma";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const status = await prisma.comment.deleteMany({
    where: { id: commentId, userId },
  });

  if (status.count) return res.sendStatus(200);
  throw res.clientError("Something went wrong", 422);
});
