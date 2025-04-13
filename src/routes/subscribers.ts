import { Router } from "express";
import SubscribersController from "@/controllers/subscribers";
import { subscribersTable, usersTable } from "@/db/schema";
import authenticate from "@/middlewares/authenticate";
import { eq } from "drizzle-orm";
import db from "@/db";
import asyncHandler from "@/lib/asyncHandler";

const subscribers = Router();

subscribers
  .use(authenticate)
  .route("/:channelId")
  .post(SubscribersController.subscribe)
  .delete(SubscribersController.unsubscribe);

subscribers.get(
  "/subscriptions",
  asyncHandler(async (req, res) => {
    const userId = req.currentUser?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const subscriptions = await db
      .select({
        channel: usersTable,
      })
      .from(subscribersTable)
      .leftJoin(usersTable, eq(usersTable.id, subscribersTable.channelId))
      .where(eq(subscribersTable.userId, userId));

    res.json(subscriptions);
  })
);

export default subscribers;
