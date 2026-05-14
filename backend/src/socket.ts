import dotenv from "dotenv";
import type http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { prisma } from "./prisma";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";
let io: Server;

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET) as {
        id: string;
        name: string;
        email: string;
      };
      socket.data.user = payload;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join-room", async ({ roomId }: { roomId: string }) => {
      if (!roomId) return;
      socket.join(roomId);
    });

    socket.on(
      "send-message",
      async (payload: { roomId: string; text?: string; image?: string }) => {
        const { roomId, text, image } = payload;
        if (!roomId || (!text && !image)) {
          return;
        }

        const user = socket.data.user;
        const message = await prisma.message.create({
          data: {
            roomId,
            senderId: user.id,
            text: text || null,
            image: image || null,
          },
          include: {
            sender: true,
          },
        });

        await prisma.room.update({
          where: { id: roomId },
          data: {
            lastMessage: text ? text : "Sent an image",
            lastActive: "Just now",
          },
        });

        io.to(roomId).emit("new-message", {
          id: message.id,
          roomId: message.roomId,
          senderId: message.senderId,
          senderName: message.sender.name,
          text: message.text,
          image: message.image,
          createdAt: message.createdAt,
        });
      },
    );

    socket.on("disconnect", () => {
      socket.rooms.forEach((room) => {
        socket.leave(room);
      });
    });
  });
}

export function getIo() {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
}
