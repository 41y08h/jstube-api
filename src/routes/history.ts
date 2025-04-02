import { Router } from "express";
import { eq } from "drizzle-orm";
import db from "../db";
import { historyTable, videosTable } from "../db/schema";

const router = Router();

router.get("/", async (req, res) => {
  const userId = req.currentUser?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const query = await db
    .select({
      video: videosTable,
      viewedAt: historyTable.viewedAt,
    })
    .from(historyTable)
    .leftJoin(videosTable, eq(historyTable.videoId, videosTable.id))
    .where(eq(historyTable.userId, userId))
    .orderBy(historyTable.viewedAt);

  res.json(query);
});

export default router;
