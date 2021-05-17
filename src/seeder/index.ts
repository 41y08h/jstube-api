import "dotenv/config";
import videosData from "./videosData";
import createDebug from "debug";
import { PrismaClient } from ".prisma/client";

(async () => {
  const debug = createDebug("app:seeder");
  // Connect database
  const prisma = new PrismaClient();

  // Clean database
  await prisma.videos.deleteMany();

  debug("🧹 Cleaned database");

  // Seed dummy user
  const dummyUser = await prisma.users.create({
    data: {
      name: "Tommy",
      email: "tommy@doggy.com",
      picture:
        "https://i.pinimg.com/600x315/1e/75/bd/1e75bd3c03fd58f747d6b625d1ba3245.jpg",
      provider: "GOOGLE",
      pid: "1864894asdas984654168a4d",
    },
  });

  debug("🌱 Created a user");

  // Seed dummy videos
  const videosSeeds = videosData.map(async (videoData) => {
    const video = await prisma.videos.create({
      data: {
        title: videoData.title,
        description: videoData.description,
        thumbnail: videoData.thumbnail,
        src: videoData.src,
        duration: videoData.duration,
        user_id: dummyUser.id,
      },
    });
    debug(`🌱 Added video ${video.title}`);
  });

  await Promise.all(videosSeeds);

  process.exit();
})();
