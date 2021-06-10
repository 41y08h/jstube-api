import { Router } from "express";
import db from "../lib/db";

const router = Router();

router.get("/", async (req, res) => {
  const { rows: list } = await db.query(
    `select "WatchLater".*, to_json("Video") as video from "WatchLater"
    left join "Video" on "videoId" = id
    where "WatchLater"."userId" = $1
    `,
    [req.currentUser?.id]
  );
  res.json(list);
});

router.post("/:id", async (req, res) => {
  const videoId = parseInt(req.params.id);

  await db.query(
    `insert into "WatchLater"("videoId", "userId") values ($1, $2)`,
    [videoId, req.currentUser?.id]
  );

  res.sendStatus(200);
});

router.delete("/:id", async (req, res) => {
  const videoId = parseInt(req.params.id);
  const userId = req.currentUser?.id;

  await db.query(
    `delete from "WatchLater" where "videoId" = $1 and "userId" = $2`,
    [videoId, userId]
  );
  res.sendStatus(200);
});

export default router;
