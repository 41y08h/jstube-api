import { UploadedFile } from "express-fileupload";
import { v4 as uuid } from "uuid";
import path from "path";
import getVideoMetaData from "./getVideoMetaData";
import generateThumbnail from "./generateVideoThubnail";
import fs from "fs";
import uploadToCloud from "@/lib/uploadToCloud";
import { videosTable } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";
import db from "@/db";

export default async function upload({
  file,
  body,
  userId,
}: {
  file: UploadedFile;
  body: {
    title: string;
    description: string;
  };
  userId: number;
}): Promise<InferInsertModel<typeof videosTable>> {
  const fileId = uuid();
  const videoFilename = `${fileId}.mp4`;
  const thumbnailFilename = `${fileId}.png`;

  const tempPath = path.join(__dirname, "../../temp");
  const videoPath = path.join(tempPath, videoFilename);
  const thumbnailPath = path.join(tempPath, thumbnailFilename);

  await file.mv(videoPath);

  const metadata = await getVideoMetaData(videoPath);
  await generateThumbnail(videoPath, thumbnailFilename, tempPath);

  const videoBase64 = file.data.toString("base64");
  const thumbnailBase64 = fs.readFileSync(thumbnailPath, {
    encoding: "base64",
  });

  console.log("uploading file to cloud");
  // Upload files
  const videoURL = await uploadToCloud(videoBase64, videoFilename);
  const thumbnailURL = await uploadToCloud(thumbnailBase64, thumbnailFilename);

  // Save in database
  const { title, description } = body;

  const [video] = await db
    .insert(videosTable)
    .values({
      title,
      description,
      src: videoURL,
      thumbnail: thumbnailURL,
      duration: parseInt(metadata.duration as string), // Ensure it's an integer
      userId: userId,
    })
    .returning(); // Returns the inserted row

  // Cleanup temp files on disk
  try {
    fs.unlinkSync(videoPath);
    fs.unlinkSync(thumbnailPath);
  } catch (err) {
    console.log(err);
  }

  return video;
}
