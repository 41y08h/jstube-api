import { PrismaClient } from ".prisma/client";
import asyncHandler from "../../../lib/asyncHandler";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.id);
  const userId = req.currentUser?.id;

  const prisma = new PrismaClient();

  const likes = await prisma.videoRating.count({
    where: { status: "LIKED", videoId },
  });
  const dislikes = await prisma.videoRating.count({
    where: { status: "DISLIKED", videoId },
  });
  const userRating = await prisma.videoRating.findFirst({
    where: { userId },
  });
  const userRatingStatus = userRating ? userRating.status : null;

  const ratingDetail = { likes, dislikes, userRatingStatus };

  res.json(ratingDetail);
});
