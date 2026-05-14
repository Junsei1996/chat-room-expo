import express from "express";
import {
    createRoom,
    getRoomByCode,
    getRoomById,
    getRoomMessages,
    getRooms,
} from "../controllers/roomController";
import { authenticateToken } from "../middleware/authMiddleware";

export const roomsRouter = express.Router();

roomsRouter.get("/", getRooms);
roomsRouter.get("/code/:code", getRoomByCode);
roomsRouter.get("/:id", getRoomById);
roomsRouter.get("/:id/messages", getRoomMessages);
roomsRouter.post("/", authenticateToken, createRoom);
