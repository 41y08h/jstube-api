import asyncHandler from "@/lib/asyncHandler";
import db from "@/db";
import { commentsTable, usersTable, commentRatingsTable } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const { text } = req.body;
  if (!text) throw res.clientError("Text field is required.", 422);

  // Get the comment we're replying to
  const [replyToComment] = await db
    .select({
      id: commentsTable.id,
      text: commentsTable.text,
      userId: commentsTable.userId,
      videoId: commentsTable.videoId,
      originalCommentId: commentsTable.originalCommentId,
      replyToCommentId: commentsTable.replyToCommentId,
    })
    .from(commentsTable)
    .where(eq(commentsTable.id, commentId));

  if (!replyToComment) throw res.clientError("Comment not found.", 404);

  const isReplyingToBase = !Boolean(replyToComment.replyToCommentId);

  // Insert reply
  const [insertedReply] = await db
    .insert(commentsTable)
    .values({
      text: text.trim(),
      userId,
      videoId: replyToComment.videoId,
      replyToCommentId: replyToComment.id,
      originalCommentId: isReplyingToBase
        ? commentId
        : replyToComment.originalCommentId,
    })
    .returning({
      id: commentsTable.id,
      userId: commentsTable.userId,
    });

  // Fetch reply with metadata
  const [reply] = await db
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
            'likes', (
              SELECT COUNT(*) FROM ${commentRatingsTable}
              WHERE ${commentRatingsTable.commentId} = ${commentsTable.id}
              AND ${commentRatingsTable.status} = 'LIKED'
            ),
            'dislikes', (
              SELECT COUNT(*) FROM ${commentRatingsTable}
              WHERE ${commentRatingsTable.commentId} = ${commentsTable.id}
              AND ${commentRatingsTable.status} = 'DISLIKED'
            )
          ),
          'userRatingStatus', (
            SELECT status FROM ${commentRatingsTable}
            WHERE ${commentRatingsTable.commentId} = ${commentsTable.id}
              AND ${commentRatingsTable.userId} = ${userId}
            LIMIT 1
          )
        )
      `.as("ratings"),
      replyCount: sql<number>`
        (
          SELECT CAST(COUNT(*) AS INTEGER) FROM ${commentsTable}
          WHERE ${commentsTable.replyToCommentId} = ${commentsTable.id}
        )
      `.as("replyCount"),
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
    .where(eq(commentsTable.id, insertedReply.id));

  res.json(reply);
});
