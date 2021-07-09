import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const userId = req.currentUser?.id;
  const beforeId = req.query.beforeId
    ? parseInt(req.query.beforeId as string)
    : undefined;

  const { rows: comments } = await db.query(
    `
    select id,
    text,
    "originalCommentId",
    "replyToCommentId",
    "userId",
    "videoId",
    "createdAt",
    "updatedAt",
    json_build_object(
    'id', "authorId",
    'name', "authorName",
    'picture', "authorPicture"
    ) as author,
    json_build_object(
        'count', json_build_object(
            'likes', "likesCount",
            'dislikes', "dislikesCount"
        ),
        'userRatingStatus', (
          select status
          from "CommentRating"
          where "commentId" = "JoinedComment".id and
                "userId" = $2
      )
    ) as ratings,
    "replyCount"
    from "JoinedComment"
    where "replyToCommentId" is null and 
          "videoId" = $1 ${beforeId ? `and id < $3` : ``}
    order by id desc
    limit 10
  `,
    [videoId, userId, beforeId].filter(Boolean)
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

  const {
    rows: [{ hasMore }],
  } = await db.query(
    `
    select (count("Comment") != 0) as "hasMore" from "Comment"
    where "videoId" = $1 and 
          "replyToCommentId" is null and
          id < $2
    `,
    [videoId, comments[comments.length - 1]?.id]
  );

  res.json({
    total,
    hasMore,
    items: comments,
  });
});
