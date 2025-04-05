import asyncHandler from "../../lib/asyncHandler";
import {
  commentsTable,
  usersTable,
  commentRatingsTable,
} from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";
import db from "../../db";

export default asyncHandler(async (req, res) => {
  const commentId = Number(req.params.id);
  const userId = req.currentUser?.id as number;

  if (!req.body.text?.trim()) {
    throw res.clientError("Text is a required field.");
  }

  // Update comment
  const [updatedComment] = await db
    .update(commentsTable)
    .set({ text: req.body.text.trim() })
    .where(
      and(eq(commentsTable.id, commentId), eq(commentsTable.userId, userId))
    )
    .returning({ id: commentsTable.id, userId: commentsTable.userId });

  if (!updatedComment) throw res.clientError("There was a problem", 422);

  // Fetch the updated comment with author details and ratings
  const [comment] = await db
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
            'likes', (SELECT COUNT(*) FROM comment_ratings WHERE comment_ratings.comment_id = comments.id AND status = 'LIKED'),
            'dislikes', (SELECT COUNT(*) FROM comment_ratings WHERE comment_ratings.comment_id = comments.id AND status = 'DISLIKED')
          ),
          'user_rating_status', (
            SELECT status FROM comment_ratings 
            WHERE comment_ratings.comment_id = comments.id AND comment_ratings.user_id = ${userId}
          )
        )
      `.as("ratings"),
      reply_count: sql`
        (SELECT COUNT(*) FROM comments AS replies WHERE replies.reply_to_comment_id = comments.id)
      `.as("reply_count"),
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
    .leftJoin(usersTable, eq(usersTable.id, commentsTable.userId))
    .where(eq(commentsTable.id, updatedComment.id));

  res.json(comment);
});
