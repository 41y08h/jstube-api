import asyncHandler from "../../lib/asyncHandler";
import prisma from "../../lib/prisma";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.id);
  const userId = req.currentUser?.id;

  const video = await prisma.video.findUnique({
    where: { id: videoId },
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
  const likes = await prisma.videoRating.count({
    where: { videoId, status: "LIKED" },
  });
  const dislikes = await prisma.videoRating.count({
    where: { videoId, status: "DISLIKED" },
  });
  const userRating = await prisma.videoRating.findFirst({
    where: { userId, videoId },
  });
  const userRatingStatus = userRating ? userRating.status : null;

  const rating = { likes, dislikes, userRatingStatus };

  if (video) return res.json({ ...video, rating });

  throw res.clientError("Video not found", 404);
});
