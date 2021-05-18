import { Router } from "express";
import VideosController from "../controllers/videos";
import authenticate from "../middlewares/authenticate";

const videos = Router();

videos
  .route("/")
  .get(VideosController.getAll)
  .post(authenticate, VideosController.upload);

videos.get("/:id", VideosController.getOne);

export default videos;
