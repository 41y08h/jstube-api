import { PrismaClient } from ".prisma/client";
import asyncHandler from "../../lib/asyncHandler";
import prisma from "../../lib/prisma";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const { text } = req.body;

  if (!text) throw res.clientError("Text field is required.", 422);

  const status = await prisma.comment.updateMany({
    where: { id: commentId, userId },
    data: { text },
  });

  if (status.count)
    return res.json(
      await prisma.comment.findUnique({ where: { id: commentId } })
    );

  throw res.clientError("Something went wrong", 422);
});
