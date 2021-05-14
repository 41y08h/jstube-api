import asyncHandler from "../../lib/asyncHandler";
import RatingService from "../../services/rating";

export default asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.currentUser?.id as string;

  await RatingService.removeRating({ userId, videoId });
  const ratingDetails = await RatingService.getDetails({
    userId,
    videoId,
  });
  res.json(ratingDetails);
});
