import { PrismaClient } from ".prisma/client";
import asyncHandler from "../../lib/asyncHandler";

export default asyncHandler(async (req, res) => {
  const prisma = new PrismaClient();
  const videos = await prisma.video.findMany({
    include: {
      channel: {
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
