import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const userId = req.currentUser?.id as number;

  if (!req.body.text) throw res.clientError("Text is a required field.");

  const {
    rows: [comment],
  } = await db.query(
    `
    with inserted as ( insert into "Comment"(text, "videoId", "userId")
    values ($1, $2, $3)
    returning *)
    select inserted.*, 
	   to_json(author) as author,
	   jsonb_build_object(
           'count', json_build_object(
               'likes', count("CommentLikes"),
               'dislikes', count("CommentDislikes")
           ),
          'userRatingStatus', (
             select status
             from "CommentRating"
             where "userId" = $3  and
                   "commentId" = inserted.id
          )
        ) as ratings
    from inserted
    left join "PublicUser" as author on
	inserted."userId" = author.id
    left join (select *, count("commentId") as count from "CommentRating" where status = 'LIKED' group by "CommentRating".id) as "CommentLikes" on
        "CommentLikes"."commentId" = inserted.id
    left join (select *, count("commentId") as count from "CommentRating" where status = 'DISLIKED' group by "CommentRating".id) as "CommentDislikes" on
        "CommentDislikes"."commentId" = inserted.id
    group by inserted.id, inserted.text, inserted."originalCommentId", inserted."replyToCommentId",
         inserted."userId", inserted."videoId", inserted."createdAt", inserted."updatedAt", author.*
    `,
    [req.body.text, videoId, userId]
  );

  res.json(comment);
});
