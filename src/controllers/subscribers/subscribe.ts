import asyncHandler from "../../lib/asyncHandler";
import { subscribersTable } from "../../db/schema";
import { and, count, eq, sql } from "drizzle-orm";
import db from "../../db";

export default asyncHandler(async (req, res) => {
  const channelId = parseInt(req.params.channelId);
  const userId = req.currentUser?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Insert subscription
  await db
    .insert(subscribersTable)
    .values({ channelId, userId })
    .onConflictDoNothing(); // Prevent duplicate subscriptions

  // Get subscription count & check if user is subscribed
  const [{ total, isUserSubscribed }] = await db
    .select({
      total: count(),
      isUserSubscribed: sql<boolean>`EXISTS (
        SELECT 1 FROM subscribers
        WHERE channel_id = ${channelId} AND user_id = ${userId}
      )`.as("isUserSubscribed"),
    })
    .from(subscribersTable)
    .where(eq(subscribersTable.channelId, channelId));

  res.json({ count: total, isUserSubscribed });
});
