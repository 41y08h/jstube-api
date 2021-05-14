import IRatingDetails from "../../interfaces/RatingDetails";
import Comment from "../../models/Comment";
import Rating from "../../models/Rating";
import Video from "../../models/Video";
import RatingItemType from "../../types/RatingItemType";

export default async function getRatingDetails({
  itemId,
  userId,
  itemType,
}: {
  itemId: string;
  userId: string;
  itemType: RatingItemType;
}): Promise<IRatingDetails> {
  const isVideoRating = itemType === "VIDEO";

  const itemPayload = {
    _video: isVideoRating ? itemId : undefined,
    _comment: isVideoRating ? undefined : itemId,
  };

  // Item should exist
  const itemExists =
    itemType === "VIDEO"
      ? await Video.exists({ _id: itemId })
      : await Comment.exists({ _id: itemId });

  if (!itemExists) throw new Error(`${itemType.toLowerCase()} not found.`);

  const likes = await Rating.countDocuments({
    ...itemPayload,
    status: "LIKED",
  });
  const dislikes = await Rating.countDocuments({
    ...itemPayload,
    status: "DISLIKED",
  });

  const userRating = await Rating.findOne({ ...itemPayload, _user: userId });
  const userStatus = userRating?.status;

  return { likes, dislikes, userStatus };
}
