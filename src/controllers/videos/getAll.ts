import asyncHandler from "../../lib/asyncHandler";
import prisma from "../../lib/prisma";

export default asyncHandler(async (req, res) => {
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
