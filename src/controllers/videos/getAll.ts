import db from "../../db";
import { usersTable, videosTable, watchLaterTable } from "../../db/schema";
import asyncHandler from "../../lib/asyncHandler";
import { and, count, desc, eq, sql } from "drizzle-orm";

export default asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 24; // 24 videos per page

  // Ensure userId is defined
  const userId = req.currentUser?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Fetch videos with pagination
  const videos = await db
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
    .leftJoin(usersTable, eq(usersTable.id, videosTable.userId)) // Joining users as "Channel"
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
