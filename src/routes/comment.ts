import { Router } from "express";
import CommentController from "../controllers/comment";
import authenticate from "../middlewares/authenticate";
import validateIdParam from "../middlewares/validateIdParam";

const comment = Router();

comment.get("/:videoId", validateIdParam("videoId"), CommentController.getAll);

comment.post(
  "/:videoId",
  authenticate,
  validateIdParam("videoId"),
  CommentController.comment
);

comment.delete(
  "/:commentId",
  authenticate,
  validateIdParam("commentId"),
  CommentController.remove
);

comment.patch(
  "/:id",
  authenticate,
  validateIdParam("id"),
  CommentController.edit
);

// Reply
comment.post(
  "/reply/:commentId",
  authenticate,
  validateIdParam("/:commentId"),
  CommentController.reply
);

export default comment;