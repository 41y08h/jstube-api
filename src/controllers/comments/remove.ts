import asyncHandler from "@/lib/asyncHandler";
import db from "@/db";
import { commentsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const result = await db
    .delete(commentsTable)
    .where(
      and(eq(commentsTable.id, commentId), eq(commentsTable.userId, userId))
    );

  if (result.rowCount && result.rowCount > 0) {
    return res.sendStatus(200);
  }

  throw res.clientError("There was a problem", 422);
});
