import { Router } from "express";
import VideosController from "../controllers/videos";
import authenticate from "../middlewares/authenticate";
import validateIdParam from "../middlewares/validateIdParam";

const videos = Router();

videos.get("/:id", validateIdParam("id"), VideosController.getOne);
videos.get("/", VideosController.getAll);
videos.post("/", authenticate, VideosController.upload);

export default videos;
