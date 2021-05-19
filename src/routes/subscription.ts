import { Router } from "express";
import SubscriptionController from "../controllers/subscription";
import authenticate from "../middlewares/authenticate";
import validateIdParam from "../middlewares/validateIdParam";

const subscription = Router();

// subscription.get(
//   "/:channelId",
//   validateIdParam("channelId"),
//   SubscriptionController.getDetails
// );
subscription.post(
  "/:channelId",
  authenticate,
  validateIdParam("channelId"),
  SubscriptionController.subscribe
);
// subscription.delete(
//   "/:channelId",
//   authenticate,
//   validateIdParam("channelId"),
//   SubscriptionController.unsubscribe
// );

export default subscription;
