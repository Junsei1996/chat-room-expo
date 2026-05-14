import cors from "cors";
import express from "express";
import path from "path";
import { authRouter } from "./routes/auth";
import { roomsRouter } from "./routes/rooms";
import { uploadRouter } from "./routes/uploads";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api/auth", authRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/upload", uploadRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
