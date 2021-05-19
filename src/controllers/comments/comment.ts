import asyncHandler from "../../lib/asyncHandler";
import prisma from "../../lib/prisma";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const userId = req.currentUser?.id as number;

  if (!req.body.text) throw res.clientError("Text is a required field.");

  const comment = await prisma.comment.create({
    data: {
      text: req.body.text,
      userId,
      videoId,
    },
  });
  res.json(comment);
});
