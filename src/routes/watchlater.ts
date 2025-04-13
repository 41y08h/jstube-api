import { Router } from "express";
import {
  watchLaterTable,
  videosTable,
  usersTable,
  videoRatingsTable,
} from "@/db/schema";
import { and, count, desc, eq, sql } from "drizzle-orm";
import db from "@/db";

const router = Router();

// Get watch later list
router.get("/", async (req, res) => {
  const pageNumber = parseInt(req.query.page as string) || 1;
  const pageSize = 24; // 24 videos per page
  const userId = req.currentUser?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const videos = await db
    .select({
      id: videosTable.id,
      title: videosTable.title,
      description: videosTable.description,
      src: videosTable.src,
      thumbnail: videosTable.thumbnail,
      duration: videosTable.duration,
      uploadedAt: videosTable.uploadedAt,
      updatedAt: videosTable.updatedAt,
      channel: {
        id: usersTable.id,
        name: usersTable.name,
        picture: usersTable.picture,
      },
      ratings: {
        likesCount: sql<number>`
                        (SELECT COUNT(*) FROM ${videoRatingsTable}
                         WHERE ${videoRatingsTable.videoId} = ${videosTable.id}
                           AND ${videoRatingsTable.status} = 'LIKED')
                      `.as("likesCount"),
        dislikesCount: sql<number>`
                        (SELECT COUNT(*) FROM ${videoRatingsTable}
                         WHERE ${videoRatingsTable.videoId} = ${videosTable.id}
                           AND ${videoRatingsTable.status} = 'DISLIKED')
                      `.as("dislikesCount"),
        userRatingStatus: sql<string | null>`
                            (
                              SELECT ${videoRatingsTable.status}
                              FROM ${videoRatingsTable}
                              WHERE ${videoRatingsTable.videoId} = ${videosTable.id}
                                AND ${videoRatingsTable.userId} = ${userId}
                              LIMIT 1
                            )
                          `.as("userRatingStatus"),
      },
      isInWL: sql<boolean>`TRUE`.as("isInWL"),
    })
    .from(watchLaterTable)
    .leftJoin(videosTable, eq(videosTable.id, watchLaterTable.videoId))
    .leftJoin(usersTable, eq(usersTable.id, videosTable.userId))
    .where(eq(watchLaterTable.userId, userId))
    .orderBy(desc(videosTable.uploadedAt))
    .offset((pageNumber - 1) * pageSize)
    .limit(pageSize);

  const totalVideos = await db
    .select({ total: count() })
    .from(watchLaterTable)
    .where(eq(watchLaterTable.userId, userId))
    .then((result) => result[0]?.total || 0);

  res.json({
    pageNumber,
    hasMore: pageNumber * pageSize < totalVideos,
    items: videos,
  });
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
