import asyncHandler from "../../../lib/asyncHandler";
import prisma from "../../../lib/prisma";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id;

  const likes = await prisma.commentRating.count({
    where: { status: "LIKED", commentId },
  });
  const dislikes = await prisma.commentRating.count({
    where: { status: "DISLIKED", commentId },
  });
  const userRating = await prisma.commentRating.findFirst({
    where: { userId, commentId },
  });
  const userRatingStatus = userRating ? userRating.status : null;

  const ratingDetail = { likes, dislikes, userRatingStatus };

  res.json(ratingDetail);
});
