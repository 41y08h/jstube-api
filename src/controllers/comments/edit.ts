import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const { text } = req.body;

  if (!text) throw res.clientError("Text field is required.", 422);

  const {
    rows: [comment],
    rowCount,
  } = await db.query(
    `
    with updated as (
      update "Comment"
      set text = $1
      where id = $2 and "userId" = $3
      returning *
    )
    select updated.*,
          to_json(author) as author,
          json_build_object(
          'count', json_build_object(
            'likes', count(distinct "cLikes"),
            'dislikes', count(distinct "cDislikes")
          ),
          'userRatingStatus', (
              select status
              from "CommentRating"
              where "commentId" = updated.id and
                    "userId" = $3
          )
      ) as ratings
    from updated
    left join "PublicUser" author on
        author.id = updated."userId"
    left join "CommentRating" "cLikes" on
        "cLikes"."commentId" = updated.id and
        "cLikes".status = 'LIKED'
    left join "CommentRating" "cDislikes" on
        "cDislikes"."commentId" = updated.id and
        "cDislikes".status = 'DISLIKED'
    group by updated.id,
            updated.text,
            updated."originalCommentId",
            updated."replyToCommentId",
            updated."userId",
            updated."videoId",
            updated."createdAt",
            updated."updatedAt",
            author.*
    `,
    [req.body.text, commentId, userId]
  );

  if (!rowCount) throw res.clientError("There was a problem", 422);

  res.json(comment);
});
