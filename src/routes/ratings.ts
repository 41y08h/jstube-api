import { Router } from "express";
import RatingsController from "../controllers/ratings";
import authenticate from "../middlewares/authenticate";

const ratings = Router();

ratings
  .route("/videos/:id")
  .get(RatingsController.videos.getDetail)
  .delete(authenticate, RatingsController.videos.removeRating);

ratings.post("/videos/:id/like", authenticate, RatingsController.videos.like);
ratings.post(
  "/videos/:id/dislike",
  authenticate,
  RatingsController.videos.dislike
);

ratings
  .route("/comments/:id")
  .get(RatingsController.comments.getDetail)
  .delete(authenticate, RatingsController.comments.removeRating);

ratings.post(
  "/comments/:id/like",
  authenticate,
  RatingsController.comments.like
);
ratings.post(
  "/comments/:id/dislike",
  authenticate,
  RatingsController.comments.dislike
);

export default ratings;
