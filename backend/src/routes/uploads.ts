import express from "express";
import { upload } from "../middleware/uploadMiddleware";

export const uploadRouter = express.Router();

uploadRouter.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Image upload failed" });
  }

  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  return res.json({ url });
});
