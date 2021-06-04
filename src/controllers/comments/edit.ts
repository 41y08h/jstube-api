import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  if (!req.body.text) throw res.clientError("Text is a required field.");

  const {
    rows: [updatedComment],
    rowCount,
  } = await db.query(
    `
    update "Comment"
    set text = $1
    where id = $2 and "userId" = $3
    returning id, "userId" 
    `,
    [req.body.text, commentId, userId]
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
    [updatedComment.id, updatedComment.userId]
  );

  res.json(comment);
});
