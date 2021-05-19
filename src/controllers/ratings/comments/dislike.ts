import prisma from "../../../lib/prisma";
import asyncHandler from "../../../lib/asyncHandler";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const existingRating = await prisma.commentRating.findFirst({
    where: { commentId, userId },
  });

  if (existingRating)
    await prisma.commentRating.update({
      where: { id: existingRating.id },
      data: { status: "DISLIKED" },
    });
  else
    await prisma.commentRating.create({
      data: { status: "LIKED", userId, commentId },
    });

  const likes = await prisma.commentRating.count({
    where: { status: "LIKED", commentId },
  });
  const dislikes = await prisma.commentRating.count({
    where: { status: "DISLIKED", commentId },
  });
  const userRating = await prisma.commentRating.findFirst({
    where: { userId },
  });
  const userRatingStatus = userRating ? userRating.status : null;

  const ratingDetail = { likes, dislikes, userRatingStatus };

  res.json(ratingDetail);
});
