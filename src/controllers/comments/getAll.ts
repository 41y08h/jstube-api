import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const userId = req.currentUser?.id;
  const page = parseInt(req.query.page as string) || 1;

  const { rows: comments } = await db.query(
    `
    select "Comment".id, 
           "Comment"."userId",
           text,
           "videoId",
           "createdAt",
           "updatedAt",
           to_jsonb(author) as author,
           json_build_object(
             'count', json_build_object(
                 'likes', count("CommentLikes"),
                 'dislikes', count("CommentDislikes")
             ),
             'userRatingStatus', (
                 select status
                 from "CommentRating"
                 where "CommentRating"."userId" = $2 and
                       "commentId" = "Comment".id
             )
           ) as ratings
    from "Comment"
    left join "PublicUser" as author on author.id = "userId"
    left join (select *, count(id) as count from "CommentRating" where status = 'LIKED' group by "CommentRating".id) as "CommentLikes" on
    "CommentLikes"."commentId" = "Comment".id
    left join (select *, count(id) as count from "CommentRating" where status = 'DISLIKED' group by "CommentRating".id) as "CommentDislikes" on
    "CommentDislikes"."commentId" = "Comment".id
    where "videoId" = $1 and "replyToCommentId" is null
    group by "Comment".id, "Comment".text, author.*
    order by id
    offset ($3 - 1)* 10
    limit 10
  `,
    [videoId, userId, page]
  );

  const {
    rows: [{ count: total }],
  } = await db.query(
    `
    select cast(count("Comment") as int) from "Comment" 
    where "videoId" = $1 and "replyToCommentId" is null
    `,
    [videoId]
  );

  res.json({
    total,
    count: comments.length,
    page,
    hasMore: page * 10 < total,
    items: comments,
  });
});
