import asyncHandler from "../../lib/asyncHandler";
import { commentsTable, usersTable } from "../../db/schema";
import { eq, sql } from "drizzle-orm";
import db from "../../db";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const userId = req.currentUser?.id;

  if (!req.body.text) throw res.clientError("Text is a required field.");

  // Insert new comment
  const [createdComment] = await db
    .insert(commentsTable)
    .values({
      text: req.body.text.trim(),
      videoId: videoId as number,
      userId: userId as number,
    })
    .returning({ id: commentsTable.id, userId: commentsTable.userId });

  if (!createdComment) throw res.clientError("There was a problem", 422);

  // Fetch the inserted comment with author details and ratings
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
        )`.as("author"),
      ratings: sql`
        json_build_object(
          'count', json_build_object(
            'likes', 0,
            'dislikes', 0
          ),
          'userRatingStatus', null
        )`.as("ratings"),
      replyCount: sql`0`.as("replyCount"),
      repliedToAuthorName: sql`NULL`,
    })
    .from(commentsTable)
    .leftJoin(usersTable, eq(usersTable.id, commentsTable.userId))
    .where(eq(commentsTable.id, createdComment.id));

  res.json(comment);
});
