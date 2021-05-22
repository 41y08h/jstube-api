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

  const userSubscription = await prisma.subscriber.findFirst({
    where: { userId },
  });
  const hasUserSubscribed = Boolean(userSubscription);

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

  if (video) {
    const data = {
      ...video,
      channel: {
        ...video.channel,
        subscription: {
          subscribers,
          hasUserSubscribed,
        },
      },
      rating,
    };
    return res.json(data);
  }

  throw res.clientError("Video not found", 404);
});
