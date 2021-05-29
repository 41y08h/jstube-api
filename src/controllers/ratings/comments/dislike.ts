import asyncHandler from "../../../lib/asyncHandler";
import db from "../../../lib/db";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const {
    rows: [existingRating],
  } = await db.query(
    `select * from "CommentRating" where "commentId" = $1 and "userId" = $2`,
    [commentId, userId]
  );

  if (existingRating) {
    await db.query(
      `
    update "CommentRating"
    set status = 'DISLIKED'
    where "commentId" = $1 and
          "userId" = $2
    `,
      [commentId, userId]
    );
  } else {
    await db.query(
      `
    insert into "CommentRating"("commentId", "userId", status)
    values ($1, $2, 'DISLIKED') returning *
  `,
      [commentId, userId]
    );
  }

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
