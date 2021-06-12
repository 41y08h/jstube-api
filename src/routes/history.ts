import { Router } from "express";
import db from "../lib/db";

const router = Router();

router.get("/", async (req, res) => {
  const userId = req.currentUser?.id;

  const query = await db.query(
    `
    select to_json(v) as video, "viewedAt" from "History"
    left join "VideoWithChannel" v on
        v.id = "History"."videoId"
    where "History"."userId" = $1
    order by "viewedAt" desc;
    `,
    [userId]
  );

  res.json(query.rows);
});

export default router;
