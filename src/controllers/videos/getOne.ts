import asyncHandler from "../../lib/asyncHandler";
import { eq, and, sql } from "drizzle-orm";
import {
  videosTable,
  usersTable,
  subscribersTable,
  videoRatingsTable,
  historyTable,
} from "../../db/schema";
import db from "../../db";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.id as string);
  const userId = req.currentUser?.id ?? null; // Ensure userId is null when undefined

  // Fetch video details with channel and ratings
  const videoQuery = await db
    .select({
      id: videosTable.id,
      title: videosTable.title,
      description: videosTable.description,
      views: videosTable.views,
      uploadedAt: videosTable.uploadedAt,
      src: videosTable.src,
      channelId: usersTable.id,
      channelName: usersTable.name,
      channelEmail: usersTable.email,
      channelPicture: usersTable.picture,
      subscribersCount: sql<number>`COALESCE(COUNT(DISTINCT ${subscribersTable.userId}), 0)`,
      likesCount: sql<number>`COALESCE(SUM(CASE WHEN ${videoRatingsTable.status} = 'LIKED' THEN 1 ELSE 0 END), 0)`,
      dislikesCount: sql<number>`COALESCE(SUM(CASE WHEN ${videoRatingsTable.status} = 'DISLIKED' THEN 1 ELSE 0 END), 0)`,
      userRatingStatus: userId
        ? sql<string | null>`
            (SELECT ${videoRatingsTable.status} 
            FROM ${videoRatingsTable} 
            WHERE ${videoRatingsTable.videoId} = ${videosTable.id} 
            AND ${videoRatingsTable.userId} = ${userId} 
            LIMIT 1)
          `
        : sql`NULL`,
    })
    .from(videosTable)
    .leftJoin(usersTable, eq(videosTable.userId, usersTable.id))
    .leftJoin(subscribersTable, eq(usersTable.id, subscribersTable.channelId))
    .leftJoin(videoRatingsTable, eq(videosTable.id, videoRatingsTable.videoId))
    .where(eq(videosTable.id, videoId))
    .groupBy(videosTable.id, usersTable.id);

  const video = videoQuery[0];

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  // Fetch isUserSubscribed separately
  let isUserSubscribed = false;
  if (userId) {
    const subscribedResult = await db.execute(
      sql`SELECT EXISTS (
      SELECT 1 FROM ${subscribersTable} 
      WHERE ${subscribersTable.userId} = ${userId} 
      AND ${subscribersTable.channelId} = ${video.channelId}
    ) as subscribed`
    );

    isUserSubscribed = !!subscribedResult.rows[0]?.subscribed;
  }

  // Structure the response properly
  res.json({
    id: video.id,
    title: video.title,
    description: video.description,
    views: video.views,
    uploadedAt: video.uploadedAt,
    src: video.src,
    channel: {
      id: video.channelId,
      name: video.channelName,
      email: video.channelEmail,
      picture: video.channelPicture,
      subscribers: {
        count: video.subscribersCount,
        isUserSubscribed,
      },
    },
    ratings: {
      count: {
        likes: video.likesCount,
        dislikes: video.dislikesCount,
      },
      userRatingStatus: video.userRatingStatus,
    },
  });

  // Record history if authenticated
  if (!userId) return;

  const [foundHistory] = await db
    .select()
    .from(historyTable)
    .where(
      and(eq(historyTable.videoId, videoId), eq(historyTable.userId, userId))
    );

  if (foundHistory) {
    await db
      .update(historyTable)
      .set({ viewedAt: new Date() })
      .where(
        and(eq(historyTable.videoId, videoId), eq(historyTable.userId, userId))
      );
  } else {
    await db.insert(historyTable).values({ videoId, userId });
  }

  // Increase video views
  await db
    .update(videosTable)
    .set({ views: sql`${videosTable.views} + 1` })
    .where(eq(videosTable.id, videoId));
});
