import IRating from "../../interfaces/Rating";
import Rating from "../../models/Rating";
import RatingItemType from "../../types/RatingItemType";

export default async function dislike({
  itemId,
  userId,
  itemType,
}: {
  itemId: string;
  userId: string;
  itemType: RatingItemType;
}): Promise<void> {
  const isVideoRating = itemType === "VIDEO";

  const itemPayload = {
    _video: isVideoRating ? itemId : undefined,
    _comment: isVideoRating ? undefined : itemId,
  };
  const alreadyDisliked = await Rating.exists({
    ...itemPayload,
    status: "DISLIKED",
  });

  if (alreadyDisliked)
    throw new Error(`${itemType.toLowerCase()} has already been disliked.`);

  // Remove any likes
  await Rating.deleteOne({ ...itemPayload, _user: userId });

  // Dislike
  const rating = new Rating({
    ...itemPayload,
    _user: userId,
    status: "DISLIKED",
    itemType,
  });
  await rating.save();
}
