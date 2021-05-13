import { Router } from "express";
import RatingController from "../controllers/rating";
import authenticate from "../middlewares/authenticate";
import validateIdParam from "../middlewares/validateIdParam";

const rating = Router();

rating.post("/:id/like", authenticate, validateIdParam, RatingController.like);
rating.post(
  "/:id/dislike",
  authenticate,
  validateIdParam,
  RatingController.dislike
);
rating.delete(
  "/:id",
  authenticate,
  validateIdParam,
  RatingController.removeRating
);

export default rating;
