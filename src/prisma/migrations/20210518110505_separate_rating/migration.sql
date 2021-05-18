/*
  Warnings:

  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_userId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_videoId_fkey";

-- DropTable
DROP TABLE "Rating";

-- CreateTable
CREATE TABLE "VideoRating" (
    "id" SERIAL NOT NULL,
    "status" "RatingStatus" NOT NULL,
    "userId" INTEGER NOT NULL,
    "videoId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentRating" (
    "id" SERIAL NOT NULL,
    "status" "RatingStatus" NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoRating.videoId_userId_unique" ON "VideoRating"("videoId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentRating.commentId_userId_unique" ON "CommentRating"("commentId", "userId");

-- AddForeignKey
ALTER TABLE "VideoRating" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoRating" ADD FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentRating" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentRating" ADD FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
