import asyncHandler from "../../lib/asyncHandler";
import { PrismaClient } from ".prisma/client";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.videoId);

  const prisma = new PrismaClient();
  const comments = await prisma.comments.findMany({
    where: { video_id: videoId },
  });
  res.json(comments);
});
