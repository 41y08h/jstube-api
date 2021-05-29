import { Router } from "express";
import SubscribersController from "../controllers/subscribers";
import authenticate from "../middlewares/authenticate";

const subscribers = Router();

subscribers
  .use(authenticate)
  .route("/:channelId")
  .post(SubscribersController.subscribe)
  .delete(SubscribersController.unsubscribe);

export default subscribers;
