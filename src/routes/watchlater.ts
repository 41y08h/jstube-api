import { Router } from "express";
import { watchLaterTable, videosTable } from "../db/schema";
import { and, eq } from "drizzle-orm";
import db from "../db";

const router = Router();

// Get watch later list
router.get("/", async (req, res) => {
  const userId = req.currentUser?.id;
  if (!userId) return res.sendStatus(401);

  const list = await db
    .select({
      id: watchLaterTable.videoId,
      userId: watchLaterTable.userId,
      video: videosTable,
    })
    .from(watchLaterTable)
    .leftJoin(videosTable, eq(videosTable.id, watchLaterTable.videoId))
    .where(eq(watchLaterTable.userId, userId));

  res.json(list);
});

// Add video to watch later
router.post("/:id", async (req, res) => {
  const videoId = parseInt(req.params.id);
  const userId = req.currentUser?.id;
  if (!userId) return res.sendStatus(401);

  await db.insert(watchLaterTable).values({ videoId, userId });
  res.sendStatus(200);
});

// Remove video from watch later
router.delete("/:id", async (req, res) => {
  const videoId = parseInt(req.params.id);
  const userId = req.currentUser?.id;
  if (!userId) return res.sendStatus(401);

  await db
    .delete(watchLaterTable)
    .where(
      and(
        eq(watchLaterTable.videoId, videoId),
        eq(watchLaterTable.userId, userId)
      )
    );

  res.sendStatus(200);
});

export default router;
