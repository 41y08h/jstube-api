import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const userId = req.currentUser?.id as number;

  if (!req.body.text) throw res.clientError("Text is a required field.");

  const {
    rows: [comment],
    rowCount,
  } = await db.query(
    `
    with inserted as (insert into "Comment"(text, "videoId", "userId")
    values ($1, $2, $3) returning *)
    select inserted.*,
          to_json(author) as author,
          json_build_object(
          'count', json_build_object(
            'likes', count(distinct "cLikes"),
            'dislikes', count(distinct "cDislikes")
          ),
          'userRatingStatus', (
              select status
              from "CommentRating"
              where "commentId" = inserted.id and
                    "userId" = $3
          )
      ) as ratings
    from inserted
    left join "PublicUser" author on
        author.id = inserted."userId"
    left join "CommentRating" "cLikes" on
        "cLikes"."commentId" = inserted.id and
        "cLikes".status = 'LIKED'
    left join "CommentRating" "cDislikes" on
        "cDislikes"."commentId" = inserted.id and
        "cDislikes".status = 'DISLIKED'
    group by inserted.id,
            inserted.text,
            inserted."originalCommentId",
            inserted."replyToCommentId",
            inserted."userId",
            inserted."videoId",
            inserted."createdAt",
            inserted."updatedAt",
            author.*
    `,
    [req.body.text, videoId, userId]
  );

  if (!rowCount) throw res.clientError("There was a problem", 422);

  res.json(comment);
});
