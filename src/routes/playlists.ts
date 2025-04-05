import { Router } from "express";
import { videosTable, videoRatingsTable, usersTable } from "../db/schema";
import { and, eq } from "drizzle-orm";
import db from "../db";

const router = Router();

router.get("/liked", async (req, res) => {
  const userId = req.currentUser?.id;
  if (!userId) return res.sendStatus(401);

  const videos = await db
    .select({
      id: videosTable.id,
      title: videosTable.title,
      description: videosTable.description,
      views: videosTable.views,
      uploadedAt: videosTable.uploadedAt,
      src: videosTable.src,
      channel: {
        id: usersTable.id,
        name: usersTable.name,
        picture: usersTable.picture,
        email: usersTable.email,
      },
    })
    .from(videosTable)
    .innerJoin(
      videoRatingsTable,
      and(
        eq(videoRatingsTable.videoId, videosTable.id),
        eq(videoRatingsTable.userId, userId),
        eq(videoRatingsTable.status, "LIKED")
      )
    )
    .innerJoin(usersTable, eq(usersTable.id, videosTable.userId));

  res.json(videos);
});

export default router;
