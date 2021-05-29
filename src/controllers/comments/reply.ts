import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";
import prisma from "../../lib/prisma";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const { text } = req.body;
  if (!text) throw res.clientError("Text field is required.", 422);

  interface T {
    id: number;
    text: string;
    userId: number;
    videoId: number;
    originalCommentId: number;
    replyToCommentId: number;
  }

  const {
    rows: [replyToComment],
  } = await db.query<T>(
    `
    select * from "Comment" where id = $1
  `,
    [commentId]
  );

  if (!replyToComment) throw res.clientError("Comment not found.", 404);

  const isReplyingToBase = !Boolean(replyToComment.replyToCommentId);

  const {
    rows: [reply],
  } = await db.query(
    `
    insert into "Comment"
    (text, 
    "userId", 
    "videoId", 
    "replyToCommentId",
    "originalCommentId")
    values ($1, $2, $3, $4, $5)
    returning *
  `,
    [
      text,
      userId,
      replyToComment.videoId,
      replyToComment.id,
      isReplyingToBase ? commentId : replyToComment.originalCommentId,
    ]
  );

  res.json(reply);
});
