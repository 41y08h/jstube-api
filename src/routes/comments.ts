import { Router } from "express";
import CommentsController from "../controllers/comments";
import authenticate from "../middlewares/authenticate";

const comments = Router();

comments
  .route("/:videoId")
  .get(CommentsController.getAll)
  .post(CommentsController.comment);

comments
  .route("/:id")
  .delete(authenticate, CommentsController.remove)
  .patch(authenticate, CommentsController.edit);

comments
  .route("/replies/:id")
  .get(CommentsController.getAllReplies)
  .post(authenticate, CommentsController.reply);

export default comments;
