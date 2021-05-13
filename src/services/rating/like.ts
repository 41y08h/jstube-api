import IRating from "../../interfaces/Rating";
import Rating from "../../models/Rating";

export default async function like({
  userId,
  videoId,
}: {
  userId: string;
  videoId: string;
}): Promise<void> {
  const alreadyLiked = await Rating.exists({
    _video: videoId,
    status: "LIKED",
  });

  if (alreadyLiked) throw new Error("Video has already been liked.");

  // Remove any dislikes
  await Rating.deleteOne({ _video: videoId, _user: userId });

  // Like
  const rating = new Rating({
    _video: videoId,
    _user: userId,
    status: "LIKED",
  });
  await rating.save();
}
