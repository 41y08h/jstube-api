import asyncHandler from "@/lib/asyncHandler";
import { commentRatingsTable } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import db from "@/db";

export default asyncHandler(async (req, res) => {
  const commentId = Number(req.params.id);
  const userId = req.currentUser?.id;

  if (!userId) throw res.clientError("Unauthorized", 401);

  // Delete comment rating
  const deletedRows = await db
    .delete(commentRatingsTable)
    .where(
      and(
        eq(commentRatingsTable.commentId, commentId),
        eq(commentRatingsTable.userId, userId)
      )
    )
    .execute();

  if (!deletedRows.rowCount) throw res.clientError("There was a problem");

  const {
    rows: [ratings],
  } = await db.execute(sql`
    SELECT
      json_build_object(
        'likes', (SELECT COUNT(*) FROM comment_ratings WHERE comment_id = ${commentId} AND status = 'LIKED'),
        'dislikes', (SELECT COUNT(*) FROM comment_ratings WHERE comment_id = ${commentId} AND status = 'DISLIKED')
      ) AS count,
      (
        SELECT status
        FROM comment_ratings
        WHERE comment_id = ${commentId} AND user_id = ${userId}
        LIMIT 1
      ) AS user_rating_status
  `);

  res.json(ratings);
});
