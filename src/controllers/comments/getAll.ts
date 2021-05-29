import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const page = parseInt(req.query.page as string) || 1;

  const { rows: comments } = await db.query(
    `
    select "Comment".id, 
           text,
           "userId",
           "videoId",
           "createdAt",
           "updatedAt",
           to_jsonb(author) as author 
    from "Comment"
    left join "PublicUser" as author on author.id = "userId"
    where "videoId" = $1 and "replyToCommentId" is null
    order by id
    offset ($2 - 1)* 10
    limit 10
  `,
    [videoId, page]
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
    current: comments.length,
    page,
    hasMore: page * 10 < total,
    comments,
  });
});
