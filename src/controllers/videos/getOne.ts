import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.id);
  const userId = req.currentUser?.id;

  const {
    rows: [video],
  } = await db.query(
    `
    select v.*,
        json_build_object(
            'id', channel.id,
            'name', channel.name,
            'email', channel.name,
            'subscribers', json_build_object(
                'count', count(distinct "Subscriber"),
                'isUserSubscribed', (
                    select "channelId"
                    from "Subscriber"
                    where "userId" = $2 and
                          "channelId" = channel.id
                ) is not null
            )
        ) as channel,
        json_build_object(
            'count', json_build_object(
                'likes', count(distinct  "vLikes"),
                'dislikes', count(distinct  "vDislikes")
            ),
            'userRatingStatus', (
                select status from "VideoRating"
                where "videoId" = v.id and "userId" = $2
            )
        ) as ratings
        from "Video" v
    left join "User" channel on
    v."userId" = channel.id
      left join "Subscriber" on
    channel.id = "Subscriber"."channelId"
      left join "VideoRating" "vLikes" on
    v.id = "vLikes"."videoId" and
      "vLikes".status = 'LIKED'
    left join "VideoRating" "vDislikes" on
      v.id = "vDislikes"."videoId" and
    "vDislikes".status = 'DISLIKED'
    where v.id = $1
    group by v.id, channel.id
  `,
    [videoId, userId]
  );
  res.json(video);
});
