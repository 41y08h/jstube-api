import { User } from ".prisma/client";
import { Video } from ".prisma/client";
import asyncHandler from "../../lib/asyncHandler";
import prisma from "../../lib/prisma";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.id);
  const userId = req.currentUser?.id;

  interface T extends Video {
    channel: {
      id: number;
      name: string;
      picture: string;
      subscribers: {
        count: number;
        isUserSubscriber: boolean;
      };
    };
    ratings: {
      count: {
        likes: number;
        dislikes: number;
      };
      userRatingStatus: "LIKED" | "DISLIKED";
    };
  }

  const data = await prisma.$queryRaw<T>`
select
       "Video".*,
       json_build_object('id', "User".id,
           'name', "User".name,
           'picture', "User".picture,
           'subscribers', json_build_object('count', count("Subscriber"), 'isUserSubscribed', "Subscriber"."userId" = 1 )) as channel,
       json_build_object(
           'count', json_build_object('likes', count("likesRating"), 'dislikes', count("dislikesRating")),
           'userRatingStatus', (case when ${userId} = "likesRating"."userId" then 'LIKED'
                                     when ${userId} = "dislikesRating"."userId" then 'DISLIKED'
                                     else null end)) as ratings
from "Video"

left join "User" on "User".id = "Video"."userId"
left join "Subscriber" on "Video"."userId" = "Subscriber"."channelId"
left join "VideoRating" "likesRating" on "Video".id = "likesRating"."videoId" and "likesRating".status = 'LIKED'
left join "VideoRating" "dislikesRating" on "Video".id = "dislikesRating"."videoId" and "dislikesRating".status = 'DISLIKED'
where "Video".id = ${videoId}
group by "Video".id, "User".id, "Subscriber".id, "likesRating"."userId", "dislikesRating"."userId"
`;

  return res.json(data[0]);

  throw res.clientError("Video not found", 404);
});
