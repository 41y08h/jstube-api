import { PrismaClient } from ".prisma/client";
import asyncHandler from "../../lib/asyncHandler";
import Comment from "../../models/Comment";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const { text } = req.body;
  if (!text) throw res.clientError("Text field is required.", 422);

  const prisma = new PrismaClient();
  const replyToComment = await prisma.comments.findFirst({
    where: { id: commentId },
  });
  if (!replyToComment) throw res.clientError("Comment not found.", 404);

  const isReplyingToBase = !Boolean(replyToComment.reply_to_comment_id);

  const replyComment = await prisma.comments.create({
    data: {
      text,
      user_id: userId,
      video_id: replyToComment.video_id,
      reply_to_comment_id: replyToComment.id,
      base_comment_id: isReplyingToBase
        ? commentId
        : replyToComment.base_comment_id,
    },
  });

  res.json(replyComment);
});
