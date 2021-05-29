import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const channelId = parseInt(req.params.channelId);
  const userId = req.currentUser?.id as number;

  const { rowCount } = await db.query(
    `
    delete from "Subscriber"
    where "channelId" = $1 and
          "userId" = $2
  `,
    [channelId, userId]
  );

  if (!rowCount) throw res.clientError("There was a problem", 422);

  const {
    rows: [subscribers],
  } = await db.query(
    `
  select cast(count("Subscriber") as int),
        (select "channelId" from "Subscriber" where "channelId" = $1 and "userId" = $2) 
        is not null as "isUserSubscribed"
  from "Subscriber"
  where "channelId" = $1
  `,
    [channelId, userId]
  );

  res.json(subscribers);
});
