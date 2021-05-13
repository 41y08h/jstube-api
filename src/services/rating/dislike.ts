import IRating from "../../interfaces/Rating";
import Rating from "../../models/Rating";

export default async function dislike({
  userId,
  videoId,
}: {
  userId: string;
  videoId: string;
}): Promise<void> {
  const alreadyDisliked = await Rating.exists({
    _video: videoId,
    status: "DISLIKED",
  });

  if (alreadyDisliked) throw new Error("Video has already been disliked.");

  // Remove any likes
  await Rating.deleteOne({ _video: videoId, _user: userId });

  // Dislike
  const rating = new Rating({
    _video: videoId,
    _user: userId,
    status: "DISLIKED",
  });
  await rating.save();
}
