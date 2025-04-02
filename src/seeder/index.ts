import "dotenv/config";
import createDebug from "debug";
import videosData from "./videos.data";
import clearConsole from "../lib/clearConsole";
import { videosTable } from "../db/schema";
import db from "../db";

const debug = createDebug("app:seeder");

async function main() {
  try {
    debug("🌱 Seeding videos...");

    for (const videoData of videosData) {
      try {
        const [video] = await db
          .insert(videosTable)
          .values({
            title: videoData.title,
            description: videoData.description,
            thumbnail: videoData.thumbnail,
            src: videoData.src,
            duration: videoData.duration,
            userId: 1, // Assuming a default user ID for seeding
          })
          .returning({ title: videosTable.title });

        if (video) {
          debug(`✅ Added video: ${video.title}`);
        } else {
          debug("⚠️ Failed to insert a video");
        }
      } catch (error) {
        debug(
          `❌ Error inserting video: ${videoData.title} -> ${error.message}`
        );
      }
    }

    debug("✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

clearConsole();
main().then(() => process.exit(0));
