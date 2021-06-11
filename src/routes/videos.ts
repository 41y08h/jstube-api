import { Router } from "express";
import VideosController from "../controllers/videos";
import db from "../lib/db";
import authenticate from "../middlewares/authenticate";

const videos = Router();

videos
  .route("/")
  .get(VideosController.getAll)
  .post(authenticate, VideosController.upload);

videos.get("/mine", async (req, res) => {
  const userId = req.currentUser?.id;
  const { rows: videos } = await db.query(
    `
  select "Video".*, to_json(channel) channel from "Video"
  left join "PublicUser" channel on 
    channel.id = "userId"
  where "userId" = $1
  `,
    [userId]
  );

  res.json(videos);
});

videos.get("/:id", VideosController.getOne);

export default videos;
