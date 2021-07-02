import "dotenv/config";
import db from "../lib/db";
import createDebug from "debug";
import videosData from "./videos.data";
import clearConsole from "../lib/clearConsole";

async function main() {
  const debug = createDebug("app:seeder");

  const videosSeeds = videosData.map(async (videoData) => {
    const {
      rows: [video],
    } = await db.query(
      `
    insert into "Video"
    (title, description, thumbnail, src, duration, "userId")
    values ($1, $2, $3, $4, $5, $6)
    returning *
    `,
      [
        videoData.title,
        videoData.description,
        videoData.thumbnail,
        videoData.src,
        videoData.duration,
        1,
      ]
    );
    debug(`🌱 Added video ${video.title}`);
  });

  await Promise.all(videosSeeds);
}

clearConsole();
main().then(() => process.exit());
