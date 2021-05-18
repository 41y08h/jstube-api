import "dotenv/config";
import videosData from "./videosData";
import createDebug from "debug";
import { PrismaClient } from ".prisma/client";

(async () => {
  const debug = createDebug("app:seeder");
  const prisma = new PrismaClient();

  const videosSeeds = videosData.map(async (videoData) => {
    const video = await prisma.video.create({
      data: {
        title: videoData.title,
        description: videoData.description,
        thumbnail: videoData.thumbnail,
        src: videoData.src,
        duration: videoData.duration,
        userId: 1,
      },
    });
    debug(`🌱 Added video ${video.title}`);
  });

  await Promise.all(videosSeeds);

  process.exit();
})();
