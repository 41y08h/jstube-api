import asyncHandler from "../../lib/asyncHandler";
import RatingService from "../../services/rating";

export default asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  const userId = req.currentUser?.id as string;

  try {
    await RatingService.dislike({ videoId, userId });
    const ratingDetails = await RatingService.getDetails({
      videoId,
      userId,
    });

    res.json(ratingDetails);
  } catch (err) {
    throw res.clientError(err.message);
  }
});
