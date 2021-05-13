import ffmpeg from "fluent-ffmpeg";
import path from "path";

export default function generateThumbnail(
  videoPath: string,
  filename: string,
  savePath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .on("end", () => resolve(savePath))
      .on("error", reject)
      .screenshots({
        timestamps: ["25%"],
        folder: savePath,
        filename,
      });
  });
}
