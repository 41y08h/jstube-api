import { Router } from "express";
import db from "../lib/db";

const router = Router();

router.get("/:id", async (req, res) => {
  const channelId = parseInt(req.params.id);
  const userId = req.currentUser?.id;

  const {
    rows: [channel],
  } = await db.query(
    `
    select 
        channel.*,
        json_build_object(
            'count', count(distinct "Subscriber"."channelId"),
            'isUserSubscribed', (
                select "channelId"
                from "Subscriber"
                where "userId" = $2 and
                      "channelId" = channel.id
            ) is not null
        ) as subscribers
    from "PublicUser" channel
    left join "Subscriber" on
        "Subscriber"."channelId" = channel.id
    where id = $1
    group by channel.id, 
             channel.name, 
             channel.email, 
             channel.picture,
             "Subscriber"."channelId"
    `,
    [channelId, userId]
  );

  res.json(channel);
});

export default router;
