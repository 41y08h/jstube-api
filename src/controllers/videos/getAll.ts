import { PrismaClient } from ".prisma/client";
import asyncHandler from "../../lib/asyncHandler";
import Video from "../../models/Video";

export default asyncHandler(async (req, res) => {
  const prisma = new PrismaClient();
  const videos = await prisma.videos.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          picture: true,
        },
      },
    },
  });
  res.json(videos);
});
