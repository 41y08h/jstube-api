import asyncHandler from "../../lib/asyncHandler";
import SubscriptionService from "../../services/subscription";

export default asyncHandler(async (req, res) => {
  const userId = req.currentUser?.id as string;
  const { channelId } = req.params;

  try {
    await SubscriptionService.unsubscribe({ userId, channelId });
    const details = await SubscriptionService.getDetails({ userId, channelId });
    res.json(details);
  } catch (err) {
    throw res.clientError(err.message);
  }
});
