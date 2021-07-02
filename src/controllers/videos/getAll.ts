import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const { rows: videos } = await db.query(
    `
  select "Video".*,
          json_build_object(
          'id', "Channel".id,
          'name', "Channel".name,
          'picture', "Channel".picture
          ) as channel
  from "Video"
  left join "User" as "Channel" on
    "Channel".id = "Video"."userId"
  order by "uploadedAt" desc
  `
  );
  res.json(videos);
});
