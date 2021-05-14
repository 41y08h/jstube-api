import Subscriber from "../../models/Subscriber";
import ISubsriptionDetails from "../../interfaces/SubscriptionDetails";

export default async function getDetails({
  channelId,
  userId,
}: {
  channelId: string;
  userId?: string;
}): Promise<ISubsriptionDetails> {
  const subscribers = await Subscriber.countDocuments({ _channel: channelId });
  const isUserSubscribed = await Subscriber.exists({
    _channel: channelId,
    _user: userId,
  });

  return { subscribers, isUserSubscribed };
}
