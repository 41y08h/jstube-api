import asyncHandler from "../../../lib/asyncHandler";
import db from "../../../db";
import { videoRatingsTable } from "../../../db/schema";
import { and, eq, sql } from "drizzle-orm";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.id);
  const userId = req.currentUser?.id || null;

  // Check if the user already has a rating for the video
  const existingRating = userId
    ? await db
        .select()
        .from(videoRatingsTable)
        .where(
          and(
            eq(videoRatingsTable.videoId, videoId),
            eq(videoRatingsTable.userId, userId)
          )
        )
        .then((res) => res[0] || null)
    : null;

  if (existingRating) {
    // Update existing rating to 'LIKED'
    await db
      .update(videoRatingsTable)
      .set({ status: "LIKED" })
      .where(
        and(
          eq(videoRatingsTable.videoId, videoId),
          eq(videoRatingsTable.userId, userId)
        )
      );
  } else if (userId) {
    // Insert new rating if user hasn't rated yet
    await db.insert(videoRatingsTable).values({
      videoId,
      userId,
      status: "LIKED",
    });
  }

  // Get user's current rating status for this video
  const userRatingStatus = userId
    ? await db
        .select({ status: videoRatingsTable.status })
        .from(videoRatingsTable)
        .where(
          and(
            eq(videoRatingsTable.videoId, videoId),
            eq(videoRatingsTable.userId, userId)
          )
        )
        .then((res) => res[0]?.status || null)
    : null;

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
