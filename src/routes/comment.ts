import { Router } from "express";
import CommentController from "../controllers/comment";
import authenticate from "../middlewares/authenticate";
import validateIdParam from "../middlewares/validateIdParam";

const comment = Router();

comment.post(
  "/:videoId",
  authenticate,
  validateIdParam("videoId"),
  CommentController.comment
);

comment.delete(
  "/:videoId",
  authenticate,
  validateIdParam("videoId"),
  CommentController.remove
);

export default comment;
