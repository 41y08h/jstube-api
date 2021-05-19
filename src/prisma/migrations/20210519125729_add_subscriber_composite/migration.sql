/*
  Warnings:

  - A unique constraint covering the columns `[channelId,userId]` on the table `Subscriber` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscriber.channelId_userId_unique" ON "Subscriber"("channelId", "userId");
