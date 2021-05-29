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
      'likes', count((select id from "CommentRating"
                      where "commentId" = $1 and status = 'LIKED')),
      'dislikes', count((select id from "CommentRating"
                      where "commentId" = $1 and status = 'DISLIKED'))
      ) as count,
      (select status from "CommentRating"
      where "commentId" = $1 and
            "userId" = $2
      ) as "userRatingStatus"
  `,
    [commentId, userId]
  );

  res.json(ratings);
});
