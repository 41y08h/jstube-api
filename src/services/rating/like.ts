import IRating from "../../interfaces/Rating";
import Rating from "../../models/Rating";
import RatingItemType from "../../types/RatingItemType";

export default async function like({
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
  const alreadyLiked = await Rating.exists({
    ...itemPayload,
    status: "LIKED",
  });

  if (alreadyLiked)
    throw new Error(`${itemType.toLowerCase()} has already been liked.`);

  // Remove any dislikes
  await Rating.deleteOne({ ...itemPayload, _user: userId });

  // Like
  const rating = new Rating({
    ...itemPayload,
    _user: userId,
    status: "LIKED",
    itemType,
  });

  await rating.save();
}
