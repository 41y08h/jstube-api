import { PrismaClient } from ".prisma/client";
import asyncHandler from "../../lib/asyncHandler";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const userId = req.currentUser?.id as number;

  if (!req.body.text) throw res.clientError("Text is a required field.");

  const prisma = new PrismaClient();
  const comment = await prisma.comments.create({
    data: {
      text: req.body.text,
      user_id: userId,
      video_id: videoId,
    },
  });
  res.json(comment);
});
