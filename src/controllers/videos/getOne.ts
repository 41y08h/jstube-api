import asyncHandler from "../../lib/asyncHandler";
import prisma from "../../lib/prisma";

export default asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  const video = await prisma.video.findUnique({
    where: { id: parseInt(videoId) },
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
  if (video) return res.json(video);

  throw res.clientError("Video not found", 404);
});
