import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.id);
  const userId = req.currentUser?.id;

  const {
    rows: [video],
  } = await db.query(
    `
    select  "Video".*,
            json_build_object(
              'id', "Channel".id,
              'name', "Channel".name,
              'picture', "Channel".picture,
              'subscribers', json_build_object(
                'count', count(
                  (select id from "Subscriber" 
                    where "channelId" = "Channel".id)),
                'isUserSubscribed', (
                  select id from "Subscriber"
                    where "userId" = $2 and
                          "channelId" = "Channel".id) is not null
              )) as channel,
            json_build_object(
              'count', json_build_object(
                'likes', count((select id from "VideoRating"
                    where "videoId" = "Video".id and
                          status = 'LIKED')),
                'dislikes', count((select id from "VideoRating"
                    where "videoId" = "Video".id and
                          status = 'DISLIKED'))
                ),
            'userRatingStatus', (
                select status from "VideoRating"
                  where "userId" = $2 and
                        "videoId" = "Video".id)
              ) as ratings,
              json_build_object(
                'count', count("Comment".id),
                'items', (
                    case when count("Comment") = 0
                        then cast('[]' as json)
                        else array_to_json(array_agg(
                            json_build_object(
                                'text', "Comment".text,
                                'author', jsonb_build_object(
                                    'id', "CommentAuthor".id,
                                    'name', "CommentAuthor".name,
                                    'picture', "CommentAuthor".picture
                                 ),
                                 'ratings', json_build_object(
                                     'count', json_build_object(
                                         'likes', (case when "CommentLikes".count is null then 0 else "CommentLikes".count end),
                                         'dislikes', (case when "CommentDislikes".count is null then 0 else "CommentDislikes".count end)
                                     ),
                                     'userRatingStatus', (
                                         select status
                                         from "CommentRating"
                                         where "userId" = $2 and
                                               "commentId" = "Comment".id
                                         )
                                  )
                            )))
                        end)
             ) as comments
    from "Video"
    left join "User" as "Channel" on
        "Channel".id = "Video"."userId"
    left join "Comment" on
        "Comment"."videoId" = "Video".id
    left join "User" as "CommentAuthor" on
        "CommentAuthor".id = "Comment"."userId"  
    left join (select *, count(id) as count from "CommentRating" where status = 'LIKED' group by "CommentRating".id) as "CommentLikes" on
        "CommentLikes"."commentId" = "Comment".id
    left join (select *, count(id) as count from "CommentRating" where status = 'DISLIKED' group by "CommentRating".id) as "CommentDislikes" on
        "CommentDislikes"."commentId" = "Comment".id  
    where "Video".id = $1
    group by "Video".id, "Channel".id
  `,
    [videoId, userId]
  );
  res.json(video);
});
