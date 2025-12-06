import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

// 🧩 Ensure the uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

function fileFilter(req, file, cb) {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
  const allowedVideoTypes = ["video/mp4", "video/mkv", "video/webm"];

  if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg, jpg, png, mp4, mkv, webm are allowed"));
  }
}

export const upload = multer({ storage, fileFilter });


