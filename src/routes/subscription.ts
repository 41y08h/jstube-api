import { Router } from "express";
import SubscriptionController from "../controllers/subscription";
import authenticate from "../middlewares/authenticate";

const subscription = Router();

subscription
  .route("/:channelId")
  .get(SubscriptionController.getDetail)
  .post(authenticate, SubscriptionController.subscribe)
  .delete(authenticate, SubscriptionController.unsubscribe);

export default subscription;
