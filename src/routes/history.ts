import { Router } from "express";
import { and, eq, sql } from "drizzle-orm";
import db from "@/db";
import {
  historyTable,
  usersTable,
  videosTable,
  watchLaterTable,
} from "@/db/schema";

const router = Router();

router.get("/", async (req, res) => {
  const userId = req.currentUser?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const query = await db
    .select({
      id: videosTable.id,
      title: videosTable.title,
      description: videosTable.description,
      src: videosTable.src,
      thumbnail: videosTable.thumbnail,
      duration: videosTable.duration,
      uploadedAt: videosTable.uploadedAt,
      viewedAt: historyTable.viewedAt,
      channel: {
        id: usersTable.id,
        name: usersTable.name,
        picture: usersTable.picture,
      },
      isInWL:
        sql<boolean>`COALESCE(${watchLaterTable.videoId} IS NOT NULL, false)`.as(
          "isInWL"
        ),
    })
    .from(historyTable)
    .leftJoin(videosTable, eq(historyTable.videoId, videosTable.id))
    .leftJoin(usersTable, eq(usersTable.id, videosTable.userId))
    .leftJoin(
      watchLaterTable,
      and(
        eq(watchLaterTable.videoId, videosTable.id),
        eq(watchLaterTable.userId, userId)
      )
    )
    .where(eq(historyTable.userId, userId))
    .orderBy(sql`${historyTable.viewedAt} DESC`);

  res.json(query);
});

export default router;
