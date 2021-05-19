import asyncHandler from "../../lib/asyncHandler";
import prisma from "../../lib/prisma";

export default asyncHandler(async (req, res) => {
  const userId = req.currentUser?.id as number;
  const channelId = parseInt(req.params.channelId);

  const status = await prisma.subscriber.deleteMany({
    where: { channelId, userId },
  });
  if (!status.count) throw res.clientError("Something went wrong.");

  const subscribers = await prisma.subscriber.count({ where: { channelId } });
  const foundSubscription = await prisma.subscriber.findFirst({
    where: { userId },
  });
  const hasUserSubscribed = Boolean(foundSubscription);

  const detail = { subscribers, hasUserSubscribed };

  res.json(detail);
});
