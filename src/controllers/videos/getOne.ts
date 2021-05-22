import asyncHandler from "../../lib/asyncHandler";
import prisma from "../../lib/prisma";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.id);
  const userId = req.currentUser?.id;

  const video = await prisma.video.findUnique({
    where: { id: videoId },
    select: {
      id: true,
      title: true,
      description: true,
      src: true,
      thumbnail: true,
      duration: true,
      views: true,
      uploadedAt: true,
      channel: {
        select: {
          id: true,
          name: true,
          picture: true,
        },
      },
    },
  });

  const subscribers = await prisma.subscriber.count({
    where: { channelId: video?.channel?.id },
  });

  const likes = await prisma.videoRating.count({
    where: { videoId, status: "LIKED" },
  });
  const dislikes = await prisma.videoRating.count({
    where: { videoId, status: "DISLIKED" },
  });

  const _count = {
    channel: {
      subscribers,
    },
    rating: {
      likes,
      dislikes,
    },
  };

  const userRating = await prisma.videoRating.findFirst({
    where: { userId, videoId },
  });
  const userRatingStatus = userRating ? userRating.status : null;

  if (video) return res.json({ ...video, _count, userRatingStatus });

  throw res.clientError("Video not found", 404);
});
