import { PrismaClient } from ".prisma/client";
import asyncHandler from "../../lib/asyncHandler";

export default asyncHandler(async (req, res) => {
  const prisma = new PrismaClient();
  const videoId = req.params.id;
  const video = await prisma.videos.findFirst({
    where: { id: parseInt(videoId) },
    include: {
      user: { select: { id: true, name: true, picture: true } },
    },
  });
  if (video) return res.json(video);

  throw res.clientError("Video not found", 404);
});
