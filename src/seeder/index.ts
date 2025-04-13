import "dotenv/config";
import createDebug from "debug";
import videosData from "./videos.data";
import { videosTable } from "@/db/schema";
import db from "@/db";

function clearConsole() {
  process.stdout.write(
    process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H"
  );
}

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
            views: videoData.views,
            userId: 1, // Assuming a default user ID for seeding
          })
          .returning({ title: videosTable.title });

        if (video) {
          debug(`✅ Added video: ${video.title}`);
        } else {
          debug("⚠️ Failed to insert a video");
        }
      } catch (error) {
        debug(`❌ Error inserting video: ${videoData.title}`);
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
