import db from "../../db";
import { usersTable, videosTable, watchLaterTable } from "../../db/schema";
import asyncHandler from "../../lib/asyncHandler";
import { and, count, desc, eq, sql } from "drizzle-orm";

export default asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 24; // 24 videos per page

  const userId = req.currentUser?.id;

  let videos;

  if (userId) {
    // If user is authenticated, fetch with watch later info
    videos = await db
      .select({
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
      .orderBy(desc(videosTable.uploadedAt))
      .offset((page - 1) * pageSize)
      .limit(pageSize);
  } else {
    // If user is NOT authenticated, fetch without watch later info
    videos = await db
      .select({
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
      })
      .from(videosTable)
      .leftJoin(usersTable, eq(usersTable.id, videosTable.userId))
      .orderBy(desc(videosTable.uploadedAt))
      .offset((page - 1) * pageSize)
      .limit(pageSize);
  }

  // Count total videos
  const totalVideos = await db
    .select({ total: count() })
    .from(videosTable)
    .then((result) => result[0]?.total || 0);

  res.json({
    page,
    hasMore: page * pageSize < totalVideos,
    items: videos,
  });
});
