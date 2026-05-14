import fs from "fs";
import multer from "multer";
import path from "path";

const uploadsPath = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsPath);
  },
  filename: (_req, file, callback) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "_");
    callback(null, `${timestamp}-${safeName}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
