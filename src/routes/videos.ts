import { Router } from "express";
import VideosController from "@/controllers/videos";
import authenticate from "@/middlewares/authenticate";
import {
  videosTable,
  usersTable,
  watchLaterTable,
  videoRatingsTable,
} from "@/db/schema";
import { and, count, desc, eq, sql } from "drizzle-orm";
import db from "@/db";
import asyncHandler from "@/lib/asyncHandler";

const videos = Router();

videos
  .route("/")
  .get(VideosController.getAll)
  .post(authenticate, VideosController.upload);

videos.get(
  "/mine",
  authenticate,
  asyncHandler(async (req, res) => {
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
          userRatingStatus: userId
            ? sql<string | null>`
                  (
                    SELECT ${videoRatingsTable.status}
                    FROM ${videoRatingsTable}
                    WHERE ${videoRatingsTable.videoId} = ${videosTable.id}
                      AND ${videoRatingsTable.userId} = ${userId}
                    LIMIT 1
                  )
                `.as("userRatingStatus")
            : sql`NULL`.as("userRatingStatus"),
        },

        isInWL:
          sql<boolean>`COALESCE(watch_laters."video_id" IS NOT NULL, false)`.as(
            "isInWL"
          ),
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
      .where(eq(videosTable.userId, userId))
      .orderBy(desc(videosTable.uploadedAt))
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Count total videos
    const totalVideos = await db
      .select({ total: count() })
      .from(videosTable)
      .where(eq(videosTable.userId, userId))

      .then((result) => result[0]?.total || 0);

    res.json({
      pageNumber,
      hasMore: pageNumber * pageSize < totalVideos,
      items: videos,
    });
  })
);

videos.get("/:id", VideosController.getOne);

export default videos;
