import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const userId = req.currentUser?.id;

  const { rows: videos } = await db.query(
    `
  select "Video".*,
          json_build_object(
          'id', "Channel".id,
          'name', "Channel".name,
          'picture', "Channel".picture
          ) as channel,
          wl is not null as "isInWL"
  from "Video"
  left join "User" as "Channel" on
    "Channel".id = "Video"."userId"
  left join "WatchLater" as wl on
    wl."videoId" = "Video".id and
    wl."userId" = $1
  order by "uploadedAt" desc
  offset ($2 - 1) * 10
  limit 24
  `,
    [userId, page]
  );

  const {
    rows: [{ count: total }],
  } = await db.query(`select cast(count("Video") as int) from "Video"`);

  res.json({
    page,
    hasMore: page * 10 < total,
    items: videos,
  });
});
