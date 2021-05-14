import Rating from "../../models/Rating";
import RatingItemType from "../../types/RatingItemType";

export default async function removeRating({
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

  await Rating.deleteOne({ ...itemPayload, _user: userId });
}
