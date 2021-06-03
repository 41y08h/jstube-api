import asyncHandler from "../../../lib/asyncHandler";
import db from "../../../lib/db";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const { rowCount } = await db.query(
    `
    delete from "CommentRating"
    where "commentId" = $1 and
          "userId" = $2
  `,
    [commentId, userId]
  );

  if (!rowCount) throw res.clientError("There was a problem");

  const {
    rows: [ratings],
  } = await db.query(
    `
    select json_build_object(
      'count', json_build_object(
          'likes', count(distinct "cLikes"),
          'dislikes', count(distinct "cDislikes")
          ),
      'userRatingStatus', (
              select status
              from "CommentRating"
              where "commentId" = $1
                and "userId" = $2
      )
      ) as ratings
    from "CommentRating"
    left join "CommentRating" "cLikes" on
      "cLikes"."commentId" = $1 and
      "cLikes".status = 'LIKED'
    left join "CommentRating" "cDislikes" on
      "cDislikes"."commentId" = $1 and
      "cDislikes".status = 'DISLIKED'
    `,
    [commentId, userId]
  );

  res.json(ratings);
});
