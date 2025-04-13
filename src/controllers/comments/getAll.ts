import asyncHandler from "@/lib/asyncHandler";
import { commentRatingsTable, commentsTable, usersTable } from "@/db/schema";
import db from "@/db";
import { and, count, desc, eq, isNull, sql } from "drizzle-orm";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const userId = req.currentUser?.id || null;
  const beforeId = req.query.beforeId
    ? parseInt(req.query.beforeId as string)
    : undefined;

  // Subquery for reply counts
  const replyCountSubquery = db
    .select({
      commentId: commentsTable.originalCommentId,
      count: sql<number>`COUNT(*)`,
    })
    .from(commentsTable)
    .where(sql`${commentsTable.originalCommentId} IS NOT NULL`)
    .groupBy(commentsTable.originalCommentId)
    .as("reply_counts");

  // Subqueries for likes and dislikes
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

  // Fetch comments with ratings, author info, and reply counts
  const comments = await db
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
        )`.as("author"),
      ratings: sql`
        json_build_object(
          'count', json_build_object(
            'likes', COALESCE(likes.count, 0),
            'dislikes', COALESCE(dislikes.count, 0)
          ),
          'userRatingStatus', (
            select status
            from ${commentRatingsTable}
            where ${commentRatingsTable.commentId} = ${commentsTable.id}
            and ${commentRatingsTable.userId} = ${userId}
            limit 1
          )
        )`.as("ratings"),
      replyCount: sql`CAST(COALESCE(reply_counts.count, 0) AS INTEGER)`.as(
        "replyCount"
      ),
      repliedToAuthorName: sql`NULL`,
    })
    .from(commentsTable)
    .leftJoin(usersTable, eq(usersTable.id, commentsTable.userId))
    .leftJoin(
      replyCountSubquery,
      eq(replyCountSubquery.commentId, commentsTable.id)
    )
    .leftJoin(likesSubquery, eq(likesSubquery.commentId, commentsTable.id))
    .leftJoin(
      dislikesSubquery,
      eq(dislikesSubquery.commentId, commentsTable.id)
    )
    .where(
      and(
        eq(commentsTable.videoId, videoId),
        isNull(commentsTable.replyToCommentId),
        beforeId ? sql`${commentsTable.id} < ${beforeId}` : undefined
      )
    )
    .orderBy(desc(commentsTable.id))
    .limit(10);

  // Fetch total comment count
  const total = await db
    .select({ count: count() })
    .from(commentsTable)
    .where(and(eq(commentsTable.videoId, videoId)))
    .then((res) => res[0]?.count || 0);

  // Check if there are more comments
  const lastCommentId = comments[comments.length - 1]?.id;
  let hasMore = false;
  if (lastCommentId) {
    hasMore = await db
      .select({ hasMore: sql<boolean>`COUNT(*) > 0` })
      .from(commentsTable)
      .where(
        and(
          eq(commentsTable.videoId, videoId),
          isNull(commentsTable.replyToCommentId),
          sql`${commentsTable.id} < ${lastCommentId}`
        )
      )
      .then((res) => res[0]?.hasMore || false);
  }

  res.json({
    total,
    hasMore,
    items: comments,
  });
});
