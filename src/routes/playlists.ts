import { Router } from "express";
import db from "../lib/db";

const router = Router();

router.get("/liked", async (req, res) => {
  const userId = req.currentUser?.id;
  const { rows: videos } = await db.query(
    `
    select "Video".*, to_json(channel) channel
    from "Video"
    left join "VideoRating" on
        "VideoRating".status = 'LIKED' and
        "VideoRating"."userId" = $1
    left join "PublicUser" as channel on
        channel.id = "Video"."userId"
    where "Video".id = "VideoRating"."videoId"
    `,
    [userId]
  );

  res.json(videos);
});

export default router;
