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

export default ratings;
