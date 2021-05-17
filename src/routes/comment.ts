import { Router } from "express";
import CommentController from "../controllers/comment";
import authenticate from "../middlewares/authenticate";
import validateIdParam from "../middlewares/validateIdParam";

const comment = Router();

comment.get("/:videoId", CommentController.getAll);

comment.post("/:videoId", authenticate, CommentController.comment);

comment.delete("/:id", authenticate, CommentController.remove);

comment.patch("/:id", authenticate, CommentController.edit);

// Reply
comment.get("/reply/:id", CommentController.getAllReplies);
comment.post("/reply/:id", authenticate, CommentController.reply);

export default comment;
