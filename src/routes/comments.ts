import { Router } from "express";
import CommentsController from "../controllers/comments";
import authenticate from "../middlewares/authenticate";

const comments = Router();

comments
  .route("/:videoId")
  .get(CommentsController.getAll)
  .post(authenticate, CommentsController.comment);

comments
  .route("/:id")
  .delete(authenticate, CommentsController.remove)
  .patch(authenticate, CommentsController.edit);

comments
  .route("/:id/replies")
  .get(CommentsController.getAllReplies)
  .post(authenticate, CommentsController.reply);

export default comments;
