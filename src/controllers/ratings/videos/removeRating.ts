import asyncHandler from "../../../lib/asyncHandler";
import db from "../../../db";
import { videoRatingsTable } from "../../../db/schema";
import { and, eq, sql } from "drizzle-orm";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.id);
  const userId = req.currentUser?.id || null;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Delete the user's rating for the video
  const deleted = await db
    .delete(videoRatingsTable)
    .where(
      and(
        eq(videoRatingsTable.videoId, videoId),
        eq(videoRatingsTable.userId, userId)
      )
    )
    .returning();

  if (!deleted.length) {
    return res.clientError("There was a problem");
  }

  // Get the user's current rating status (should be null after deletion)
  const userRatingStatus = await db
    .select({ status: videoRatingsTable.status })
    .from(videoRatingsTable)
    .where(
      and(
        eq(videoRatingsTable.videoId, videoId),
        eq(videoRatingsTable.userId, userId)
      )
    )
    .then((res) => res[0]?.status || null);

  // Get aggregated likes/dislikes count
  const ratings = await db
    .select({
      count: sql`
        json_build_object(
          'likes', COUNT(*) FILTER (WHERE ${videoRatingsTable.status} = 'LIKED'),
          'dislikes', COUNT(*) FILTER (WHERE ${videoRatingsTable.status} = 'DISLIKED')
        )`.as("count"),
    })
    .from(videoRatingsTable)
    .where(eq(videoRatingsTable.videoId, videoId))
    .then((res) => ({
      ...res[0],
      userRatingStatus,
    }));

  res.json(ratings);
});
