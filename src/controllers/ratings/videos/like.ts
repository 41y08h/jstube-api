import asyncHandler from "../../../lib/asyncHandler";
import db from "../../../lib/db";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const {
    rows: [existingRating],
  } = await db.query(
    `select * from "VideoRating" where "videoId" = $1 and "userId" = $2`,
    [videoId, userId]
  );

  if (existingRating) {
    await db.query(
      `
    update "VideoRating"
    set status = 'LIKED'
    where "videoId" = $1 and
          "userId" = $2
    `,
      [videoId, userId]
    );
  } else {
    await db.query(
      `
    insert into "VideoRating"("videoId", "userId", status)
    values ($1, $2, 'LIKED') returning *
  `,
      [videoId, userId]
    );
  }

  const {
    rows: [ratings],
  } = await db.query(
    `
    select json_build_object(
      'likes', count((select id from "VideoRating"
                      where "videoId" = $1 and status = 'LIKED')),
      'dislikes', count((select id from "VideoRating"
                      where "videoId" = $1 and status = 'DISLIKED'))
      ) as count,
      (select status from "VideoRating"
      where "videoId" = $1 and
            "userId" = $2
      ) as "userRatingStatus"
  `,
    [videoId, userId]
  );

  res.json(ratings);
});
