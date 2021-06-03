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
    set status = 'LIKED'
    where "commentId" = $1 and
          "userId" = $2
    `,
      [commentId, userId]
    );
  } else {
    await db.query(
      `
    insert into "CommentRating"("commentId", "userId", status)
    values ($1, $2, 'LIKED') returning *
  `,
      [commentId, userId]
    );
  }

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
