import Subscriber from "../../models/Subscriber";

export default async function subscribe({
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

  if (isSubscribed) throw new Error("Already subscribed to the channel.");

  const subscriber = new Subscriber({ _user: userId, _channel: channelId });
  await subscriber.save();
}
