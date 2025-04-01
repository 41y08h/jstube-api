import { Router } from "express";
import VideosController from "../controllers/videos";
import authenticate from "../middlewares/authenticate";
import { videosTable, usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import db from "../db";

const videos = Router();

videos
  .route("/")
  .get(VideosController.getAll)
  .post(authenticate, VideosController.upload);

videos.get("/mine", authenticate, async (req, res) => {
  const userId = req.currentUser?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userVideos = await db
    .select({
      video: videosTable,
      channel: usersTable,
    })
    .from(videosTable)
    .leftJoin(usersTable, eq(usersTable.id, videosTable.user_id))
    .where(eq(videosTable.user_id, userId));

  res.json(userVideos);
});

videos.get("/:id", VideosController.getOne);

export default videos;
