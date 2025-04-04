import asyncHandler from "../../../lib/asyncHandler";
import { commentRatingsTable } from "../../../db/schema";
import { eq, and, sql } from "drizzle-orm";
import db from "../../../db";

export default asyncHandler(async (req, res) => {
  const commentId = Number(req.params.id);
  const userId = req.currentUser?.id;

  if (!userId) throw res.clientError("Unauthorized", 401);

  // Check if a rating already exists
  const [existingRating] = await db
    .select()
    .from(commentRatingsTable)
    .where(
      and(
        eq(commentRatingsTable.commentId, commentId),
        eq(commentRatingsTable.userId, userId)
      )
    );

  if (existingRating) {
    // Update existing rating to 'LIKED'
    await db
      .update(commentRatingsTable)
      .set({ status: "LIKED" })
      .where(
        and(
          eq(commentRatingsTable.commentId, commentId),
          eq(commentRatingsTable.userId, userId)
        )
      );
  } else {
    // Insert new rating as 'LIKED'
    await db.insert(commentRatingsTable).values({
      commentId,
      userId,
      status: "LIKED",
    });
  }

  // Fetch updated like/dislike counts and user rating status
  const [ratings] = await db
    .select({
      count: sql`
        json_build_object(
          'likes', (SELECT COUNT(*) FROM comment_ratings WHERE comment_ratings.comment_id = ${commentId} AND status = 'LIKED'),
          'dislikes', (SELECT COUNT(*) FROM comment_ratings WHERE comment_ratings.comment_id = ${commentId} AND status = 'DISLIKED')
        )
      `.as("count"),
      userRatingStatus: sql`
        (SELECT status FROM comment_ratings WHERE comment_ratings.comment_id = ${commentId} AND comment_ratings.user_id = ${userId})
      `.as("userRatingStatus"),
    })
    .from(commentRatingsTable)
    .where(eq(commentRatingsTable.commentId, commentId));

  res.json(ratings);
});
