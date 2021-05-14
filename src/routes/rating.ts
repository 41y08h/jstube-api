import { Router } from "express";
import RatingController from "../controllers/rating";
import authenticate from "../middlewares/authenticate";
import validateIdParam from "../middlewares/validateIdParam";

const rating = Router();

rating.get(
  "/:videoId",
  validateIdParam("videoId"),
  RatingController.getDetails
);
rating.post(
  "/:videoId",
  authenticate,
  validateIdParam("videoId"),
  RatingController.like
);
rating.post(
  "/:videoId/dislike",
  authenticate,
  validateIdParam("/:videoId"),
  RatingController.dislike
);
rating.delete(
  "/:videoId",
  authenticate,
  validateIdParam("/:videoId"),
  RatingController.removeRating
);

export default rating;
