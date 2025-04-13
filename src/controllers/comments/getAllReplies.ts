import asyncHandler from "@/lib/asyncHandler";
import db from "@/db";
import { commentsTable, usersTable, commentRatingsTable } from "@/db/schema";
import { and, count, desc, eq, isNull, sql } from "drizzle-orm";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id;
  const beforeId = req.query.beforeId
    ? parseInt(req.query.beforeId as string)
    : undefined;

  // Subqueries
  const likesSubquery = db
    .select({
      commentId: commentRatingsTable.commentId,
      count: sql<number>`COUNT(*)`,
    })
    .from(commentRatingsTable)
    .where(eq(commentRatingsTable.status, "LIKED"))
    .groupBy(commentRatingsTable.commentId)
    .as("likes");

  const dislikesSubquery = db
    .select({
      commentId: commentRatingsTable.commentId,
      count: sql<number>`COUNT(*)`,
    })
    .from(commentRatingsTable)
    .where(eq(commentRatingsTable.status, "DISLIKED"))
    .groupBy(commentRatingsTable.commentId)
    .as("dislikes");

  const replyCountSubquery = db
    .select({
      replyToCommentId: commentsTable.replyToCommentId,
      count: sql<number>`COUNT(*)`,
    })
    .from(commentsTable)
    .where(sql`${commentsTable.replyToCommentId} IS NOT NULL`)
    .groupBy(commentsTable.replyToCommentId)
    .as("reply_counts");

  // Main comment replies query
  const replies = await db
    .select({
      id: commentsTable.id,
      text: commentsTable.text,
      originalCommentId: commentsTable.originalCommentId,
      replyToCommentId: commentsTable.replyToCommentId,
      userId: commentsTable.userId,
      videoId: commentsTable.videoId,
      createdAt: commentsTable.createdAt,
      updatedAt: commentsTable.updatedAt,
      author: sql`
        json_build_object(
          'id', ${usersTable.id},
          'name', ${usersTable.name},
          'picture', ${usersTable.picture}
        )
      `.as("author"),
      ratings: sql`
        json_build_object(
          'count', json_build_object(
            'likes', COALESCE(likes.count, 0),
            'dislikes', COALESCE(dislikes.count, 0)
          ),
          'userRatingStatus', (
            SELECT status
            FROM ${commentRatingsTable}
            WHERE ${commentRatingsTable.commentId} = ${commentsTable.id}
              AND ${commentRatingsTable.userId} = ${userId}
            LIMIT 1
          )
        )
      `.as("ratings"),
      replyCount: sql`CAST(COALESCE(reply_counts.count, 0) AS INTEGER)`.as(
        "replyCount"
      ),
      repliedToAuthorName: sql`
      (
        SELECT ${usersTable.name}
        FROM ${commentsTable} AS parent
        JOIN ${usersTable} ON ${usersTable.id} = parent.user_id
        WHERE parent.id = ${commentsTable.replyToCommentId}
        LIMIT 1
      )
    `.as("repliedToAuthorName"),
    })
    .from(commentsTable)
    .leftJoin(usersTable, eq(commentsTable.userId, usersTable.id))
    .leftJoin(likesSubquery, eq(likesSubquery.commentId, commentsTable.id))
    .leftJoin(
      dislikesSubquery,
      eq(dislikesSubquery.commentId, commentsTable.id)
    )
    .leftJoin(
      replyCountSubquery,
      eq(replyCountSubquery.replyToCommentId, commentsTable.id)
    )
    .where(
      and(
        eq(commentsTable.originalCommentId, commentId),
        beforeId ? sql`${commentsTable.id} < ${beforeId}` : undefined
      )
    )
    .orderBy(desc(commentsTable.id))
    .limit(10);

  // Total reply count
  const total = await db
    .select({ count: count() })
    .from(commentsTable)
    .where(eq(commentsTable.originalCommentId, commentId))
    .then((res) => res[0]?.count || 0);

  // Has more replies?
  let hasMore = false;
  const lastId = replies[replies.length - 1]?.id;
  if (lastId) {
    const result = await db
      .select({ hasMore: sql<boolean>`COUNT(*) > 0` })
      .from(commentsTable)
      .where(
        and(
          eq(commentsTable.originalCommentId, commentId),
          sql`${commentsTable.id} < ${lastId}`
        )
      );
    hasMore = result[0]?.hasMore || false;
  }

  res.json({
    total,
    hasMore,
    items: replies,
  });
});
