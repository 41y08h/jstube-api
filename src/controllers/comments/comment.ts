import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const userId = req.currentUser?.id as number;

  if (!req.body.text) throw res.clientError("Text is a required field.");

  const {
    rows: [createdComment],
    rowCount,
  } = await db.query(
    `
    insert into "Comment"(text, "videoId", "userId")
    values ($1, $2, $3) returning id, "userId"   
    `,
    [req.body.text.trim(), videoId, userId]
  );

  if (!rowCount) throw res.clientError("There was a problem", 422);

  const {
    rows: [comment],
  } = await db.query(
    `
    select id,
        text,
        "originalCommentId",
        "replyToCommentId",
        "userId",
        "videoId",
        "createdAt",
        "updatedAt",
        json_build_object(
        'id', "authorId",
        'name', "authorName",
        'picture', "authorPicture"
        ) as author,
        json_build_object(
            'count', json_build_object(
                'likes', "likesCount",
                'dislikes', "dislikesCount"
            ),
            'userRatingStatus', (
              select status
              from "CommentRating"
              where "commentId" = "JoinedComment".id and
                    "userId" = $2
          )
        ) as ratings,
        "replyCount"
    from "JoinedComment" where id = $1
    `,
    [createdComment.id, createdComment.userId]
  );

  res.json(comment);
});
