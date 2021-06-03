import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

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
    with inserted as (
      insert into "Comment"(text, "userId", "videoId", "replyToCommentId", "originalCommentId")
      values ($1, $2, $3, $4, $5) returning *
    )
    select inserted.*,
          to_json(author) as author,
          json_build_object(
          'count', json_build_object(
            'likes', count(distinct "cLikes"),
            'dislikes', count(distinct "cDislikes")
          ),
          'userRatingStatus', (
              select status
              from "CommentRating"
              where "commentId" = inserted.id and
                    "userId" = $2
          )
      ) as ratings
    from inserted
    left join "PublicUser" author on
        author.id = inserted."userId"
    left join "CommentRating" "cLikes" on
        "cLikes"."commentId" = inserted.id and
        "cLikes".status = 'LIKED'
    left join "CommentRating" "cDislikes" on
        "cDislikes"."commentId" = inserted.id and
        "cDislikes".status = 'DISLIKED'
    group by inserted.id,
          inserted.text,
          inserted."originalCommentId",
          inserted."replyToCommentId",
          inserted."userId",
          inserted."videoId",
          inserted."createdAt",
          inserted."updatedAt",
          author.*
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
