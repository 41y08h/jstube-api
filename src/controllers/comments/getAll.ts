import asyncHandler from "../../lib/asyncHandler";
import { PrismaClient } from ".prisma/client";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.videoId);

  const prisma = new PrismaClient();
  const comments = await prisma.comment.findMany({
    where: {
      videoId,
      replyToCommentId: null,
    },
    select: {
      id: true,
      text: true,
      author: {
        select: {
          id: true,
          name: true,
          picture: true,
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
  });

  res.json(comments);
});
