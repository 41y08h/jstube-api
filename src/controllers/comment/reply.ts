import { PrismaClient } from ".prisma/client";
import asyncHandler from "../../lib/asyncHandler";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const { text } = req.body;
  if (!text) throw res.clientError("Text field is required.", 422);

  const prisma = new PrismaClient();
  const replyToComment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!replyToComment) throw res.clientError("Comment not found.", 404);

  const isReplyingToBase = !Boolean(replyToComment.replyToCommentId);

  const replyComment = await prisma.comment.create({
    data: {
      text,
      userId,
      videoId: replyToComment.videoId,
      replyToCommentId: replyToComment.id,
      baseCommentId: isReplyingToBase
        ? commentId
        : replyToComment.baseCommentId,
    },
  });

  res.json(replyComment);
});
