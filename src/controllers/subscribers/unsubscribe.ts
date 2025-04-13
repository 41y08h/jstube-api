import asyncHandler from "@/lib/asyncHandler";
import { subscribersTable } from "@/db/schema";
import { and, count, eq, sql } from "drizzle-orm";
import db from "@/db";

export default asyncHandler(async (req, res) => {
  const channelId = parseInt(req.params.channelId);
  const userId = req.currentUser?.id as number;

  // Delete subscription
  const result = await db
    .delete(subscribersTable)
    .where(
      and(
        eq(subscribersTable.channelId, channelId),
        eq(subscribersTable.userId, userId)
      )
    )
    .execute();

  if (result.rowCount === 0) {
    throw res.clientError("There was a problem", 422);
  }

  // Fetch updated subscriber count & check if the user is still subscribed
  const [{ total, isUserSubscribed }] = await db
    .select({
      total: count(),
      isUserSubscribed: sql<boolean>`EXISTS (
        SELECT 1 FROM ${subscribersTable}
        WHERE ${subscribersTable.channelId} = ${channelId} 
        AND ${subscribersTable.userId} = ${userId}
      )`,
    })
    .from(subscribersTable)
    .where(eq(subscribersTable.channelId, channelId));

  res.json({ count: total, isUserSubscribed });
});
