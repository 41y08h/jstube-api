import Rating from "../../models/Rating";

export default async function removeRating({
  userId,
  videoId,
}: {
  userId: string;
  videoId: string;
}): Promise<void> {
  await Rating.deleteOne({ _user: userId, _video: videoId });
}
