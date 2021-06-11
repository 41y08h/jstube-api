import asyncHandler from "../../../lib/asyncHandler";
import db from "../../../lib/db";

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
          'likes', count(distinct "vLikes"),
          'dislikes', count(distinct "vDislikes")
       ) as count,
      (
        select status
        from "VideoRating"
        where "videoId" = $1
          and "userId" = $2
      ) as "userRatingStatus"
    from "VideoRating"
    left join "VideoRating" "vLikes" on
      "vLikes"."videoId" = $1 and
      "vLikes".status = 'LIKED'
    left join "VideoRating" "vDislikes" on
      "vDislikes"."videoId" = $1 and
      "vDislikes".status = 'DISLIKED'
  `,
    [videoId, userId]
  );

  res.json(ratings);
});
