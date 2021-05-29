import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const { rowCount } = await db.query(
    `
    delete from "Comment"
    where id = $1 and
          "userId" = $2
  `,
    [commentId, userId]
  );

  if (rowCount) return res.sendStatus(200);
  throw res.clientError("There was a problem", 422);
});
