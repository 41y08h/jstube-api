import asyncHandler from "../../lib/asyncHandler";
import RatingService from "../../services/rating";

export default asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  const userId = req.currentUser?.id;

  const ratingDetails = await RatingService.getDetails({
    videoId,
    userId,
  });

  res.json(ratingDetails);
});
