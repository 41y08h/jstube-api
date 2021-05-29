import asyncHandler from "../../../lib/asyncHandler";
import db from "../../../lib/db";
import prisma from "../../../lib/prisma";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const { rowCount } = await db.query(
    `
    delete from "VideoRating"
    where "videoId" = $1 and
          "userId" = $2
  `,
    [videoId, userId]
  );

  if (!rowCount) throw res.clientError("There was a problem");

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
