import IRatingDetails from "../../interfaces/RatingDetails";
import Rating from "../../models/Rating";

export default async function getRatingDetails({
  videoId,
  userId,
}: {
  videoId: string;
  userId?: string;
}): Promise<IRatingDetails> {
  const likes = await Rating.countDocuments({
    _video: videoId,
    status: "LIKED",
  });
  const dislikes = await Rating.countDocuments({
    _video: videoId,
    status: "DISLIKED",
  });

  const userRating = await Rating.findOne({ _video: videoId, _user: userId });
  const userStatus = userRating?.status;

  return { likes, dislikes, userStatus };
}
