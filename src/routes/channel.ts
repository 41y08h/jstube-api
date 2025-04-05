import { Router } from "express";
import {
  usersTable,
  subscribersTable,
  videosTable,
  watchLaterTable,
} from "../db/schema";
import { and, count, desc, eq, sql } from "drizzle-orm";
import db from "../db";

const router = Router();

router.get("/:id", async (req, res) => {
  const channelId = parseInt(req.params.id);
  const userId = req.currentUser?.id ?? null;

  const result = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      picture: usersTable.picture,
      subscribers: sql`
        json_build_object(
          'count', COUNT(DISTINCT ${subscribersTable.userId}),
          'isUserSubscribed', ${
            userId !== null
              ? sql`EXISTS (
                  SELECT 1
                  FROM ${subscribersTable}
                  WHERE ${subscribersTable.channelId} = ${usersTable.id}
                  AND ${subscribersTable.userId} = ${userId}
                )`
              : sql`false`
          }
        )
      `.as("subscribers"),
    })
    .from(usersTable)
    .leftJoin(subscribersTable, eq(subscribersTable.channelId, usersTable.id))
    .where(eq(usersTable.id, channelId))
    .groupBy(usersTable.id);

  res.json(result[0]);
});

router.get("/:id/videos", async (req, res) => {
  const channelId = parseInt(req.params.id);
  const userId = req.currentUser?.id ?? null;
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 24;

  const baseSelect = {
    id: videosTable.id,
    title: videosTable.title,
    description: videosTable.description,
    src: videosTable.src,
    thumbnail: videosTable.thumbnail,
    duration: videosTable.duration,
    uploadedAt: videosTable.uploadedAt,
    channel: {
      id: usersTable.id,
      name: usersTable.name,
      picture: usersTable.picture,
    },
  };

  const videos = await db
    .select({
      ...baseSelect,
      ...(userId
        ? {
            isInWL:
              sql<boolean>`COALESCE(${watchLaterTable.videoId} IS NOT NULL, false)`.as(
                "isInWL"
              ),
          }
        : {}),
    })
    .from(videosTable)
    .leftJoin(usersTable, eq(usersTable.id, videosTable.userId))
    .leftJoin(
      watchLaterTable,
      and(
        eq(watchLaterTable.videoId, videosTable.id),
        eq(watchLaterTable.userId, userId)
      )
    )
    .where(eq(videosTable.userId, channelId))
    .orderBy(desc(videosTable.uploadedAt))
    .offset((page - 1) * pageSize)
    .limit(pageSize);

  const totalVideos = await db
    .select({ total: count() })
    .from(videosTable)
    .where(eq(videosTable.userId, channelId))
    .then((res) => res[0]?.total || 0);

  res.json({
    page,
    hasMore: page * pageSize < totalVideos,
    items: videos,
  });
});

export default router;
