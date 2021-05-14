import { Router } from "express";
import SubscriptionController from "../controllers/subscription";
import authenticate from "../middlewares/authenticate";
import validateIdParam from "../middlewares/validateIdParam";

const subscription = Router();

subscription.get("/:id", validateIdParam, SubscriptionController.getDetails);
subscription.post(
  "/:id",
  authenticate,
  validateIdParam,
  SubscriptionController.subscribe
);
subscription.delete(
  "/:id",
  authenticate,
  validateIdParam,
  SubscriptionController.unsubscribe
);

export default subscription;
