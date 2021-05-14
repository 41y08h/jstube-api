import asyncHandler from "../../lib/asyncHandler";
import RatingService from "../../services/rating";

export default asyncHandler(async (req, res) => {
  const itemType = req.query.type;

  if (!(itemType === "COMMENT" || itemType === "VIDEO"))
    throw res.clientError("Type must be COMMENT or VIDEO.");

  const { itemId } = req.params;
  const userId = req.currentUser?.id as string;

  try {
    await RatingService.removeRating({ userId, itemId, itemType });
    const ratingDetails = await RatingService.getDetails({
      userId,
      itemId,
      itemType,
    });
    res.json(ratingDetails);
  } catch (err) {
    throw res.clientError(err.message);
  }
});
