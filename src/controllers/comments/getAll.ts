import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const userId = req.currentUser?.id;
  const page = parseInt(req.query.page as string) || 1;

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
          "videoId" = $1
    order by id
    offset ($3 - 1) * 10
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
