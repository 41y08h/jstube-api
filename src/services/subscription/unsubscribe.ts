import Subscriber from "../../models/Subscriber";

export default async function unsubscribe({
  userId,
  channelId,
}: {
  userId: string;
  channelId: string;
}): Promise<void> {
  // Check if the user is already subscribed
  const isSubscribed = await Subscriber.exists({
    _user: userId,
    _channel: channelId,
  });

  if (!isSubscribed) throw new Error("Not subscribed to the channel.");

  await Subscriber.deleteOne({ _user: userId, _channel: channelId });
}
