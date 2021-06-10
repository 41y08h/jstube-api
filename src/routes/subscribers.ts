import { Router } from "express";
import SubscribersController from "../controllers/subscribers";
import db from "../lib/db";
import authenticate from "../middlewares/authenticate";

const subscribers = Router();

subscribers
  .use(authenticate)
  .route("/:channelId")
  .post(SubscribersController.subscribe)
  .delete(SubscribersController.unsubscribe);

subscribers.get("/subscriptions", async (req, res) => {
  const userId = req.currentUser?.id;

  const { rows } = await db.query(
    `
  select "Subscriber".*, to_json(channel) as channel from "Subscriber"
  left join "PublicUser" as channel on
  id = "channelId"
  where "userId" = $1  
  `,
    [userId]
  );

  res.json(rows);
});

export default subscribers;
