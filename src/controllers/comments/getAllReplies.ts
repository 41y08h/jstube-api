import asyncHandler from "../../lib/asyncHandler";
import prisma from "../../lib/prisma";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);

  const replies = await prisma.comment.findMany({
    where: { baseCommentId: commentId },
  });
  res.json(replies);
});
