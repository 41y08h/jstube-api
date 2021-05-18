-- CreateEnum
CREATE TYPE "RatingStatus" AS ENUM ('LIKED', 'DISLIKED');

-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "status" "RatingStatus" NOT NULL,
    "userId" INTEGER NOT NULL,
    "videoId" INTEGER,
    "commentId" INTEGER,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rating" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
