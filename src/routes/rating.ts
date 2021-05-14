import { Router } from "express";
import RatingController from "../controllers/rating";
import authenticate from "../middlewares/authenticate";
import validateIdParam from "../middlewares/validateIdParam";

const rating = Router();

rating.get("/:itemId", validateIdParam("itemId"), RatingController.getDetails);
rating.post(
  "/:itemId/like",
  authenticate,
  validateIdParam("itemId"),
  RatingController.like
);
rating.post(
  "/:itemId/dislike",
  authenticate,
  validateIdParam("/:itemId"),
  RatingController.dislike
);
rating.delete(
  "/:itemId",
  authenticate,
  validateIdParam("/:itemId"),
  RatingController.removeRating
);

export default rating;
