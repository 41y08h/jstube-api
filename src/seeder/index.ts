import "dotenv/config";
import User from "../models/User";
import Video from "../models/Video";
import DatabaseService from "../services/database";
import videosData from "./videosData";
import createDebug from "debug";

(async () => {
  const debug = createDebug("app:seeder");
  // Connect database
  await DatabaseService.connect();

  // Clean database
  await User.deleteMany({});
  await Video.deleteMany({});

  debug("🧹 Cleaned database");

  // Seed dummy user
  const dummyUser = new User({
    name: "Tommy",
    email: "tommy@doggy.com",
    picture:
      "https://i.pinimg.com/600x315/1e/75/bd/1e75bd3c03fd58f747d6b625d1ba3245.jpg",
    provider: { name: "GOOGLE", accountId: "1864894asdas984654168a4d" },
    subscribers: 48716487,
  });

  await dummyUser.save();

  debug("🌱 Created a user");

  // Seed dummy videos
  const videosSeeds = videosData.map(async (videoData) => {
    const video = new Video({
      ...videoData,
      _user: dummyUser.id,
    });
    await video.save();
    debug(`🌱 Added video ${video.title}`);
  });

  await Promise.all(videosSeeds);

  process.exit();
})();
