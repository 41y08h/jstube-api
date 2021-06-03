import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id;
  const page = parseInt(req.query.page as string) || 1;

  const { rows: replies } = await db.query(
    `
    select "Comment".*,
        to_json(author) as author,
        json_build_object(
                'count', json_build_object(
                'likes', count(distinct "cLikes"),
                'dislikes', count(distinct "cDislikes")
            ),
                'userRatingStatus', (
                    select status
                    from "CommentRating"
                    where "commentId" = "Comment".id
                      and "userId" = $2
                )
            )           as ratings
    from "Comment"
    left join "PublicUser" author on
      author.id = "Comment"."userId"
    left join "CommentRating" "cLikes" on
      "cLikes"."commentId" = "Comment".id and
      "cLikes".status = 'LIKED'
    left join "CommentRating" "cDislikes" on
      "cDislikes"."commentId" = "Comment".id and
      "cDislikes".status = 'DISLIKED'
    where "originalCommentId" = $1
    group by "Comment".id, author.*
    order by id
    offset ($3 - 1) * 10
    limit 10
  `,
    [commentId, userId, page]
  );

  const {
    rows: [{ count: total }],
  } = await db.query(
    `
    select cast(count("Comment") as int) from "Comment" 
    where "originalCommentId" = $1
    `,
    [commentId]
  );

  res.json({
    total,
    count: replies.length,
    page,
    hasMore: page * 10 < total,
    items: replies,
  });
});
