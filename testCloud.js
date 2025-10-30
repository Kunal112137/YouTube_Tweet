import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const testUpload = async () => {
  try {
    // Make sure the file exists in the same folder or provide correct path
    const localFilePath = "./opera.jpg";

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("✅ Uploaded URL:", result.url);

    // Optional: delete local file after upload
    await fs.unlink(localFilePath);
  } catch (err) {
    console.error("❌ Cloudinary upload failed:", err.message);
  }
};

testUpload();
