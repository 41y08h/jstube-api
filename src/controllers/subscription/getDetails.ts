import asyncHandler from "../../lib/asyncHandler";
import SubscriptionService from "../../services/subscription";

export default asyncHandler(async (req, res) => {
  const userId = req.currentUser?.id;
  const channelId = req.params.id;

  const subscriptionDetails = await SubscriptionService.getDetails({
    userId,
    channelId,
  });
  res.json(subscriptionDetails);
});
