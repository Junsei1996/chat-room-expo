import dotenv from "dotenv";
import type http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { prisma } from "./prisma";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";
let io: Server;
const roomPresence = new Map<string, Set<string>>();

function getRoomSet(roomId: string) {
  if (!roomPresence.has(roomId)) {
    roomPresence.set(roomId, new Set());
  }
  return roomPresence.get(roomId)!;
}

function emitRoomPresence(roomId: string) {
  const set = roomPresence.get(roomId);
  io.to(roomId).emit("room-presence", {
    roomId,
    onlineCount: set ? set.size : 0,
  });
}

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

      try {
        await prisma.roomMember.upsert({
          where: {
            userId_roomId: {
              userId: socket.data.user.id,
              roomId,
            },
          },
          update: {},
          create: {
            userId: socket.data.user.id,
            roomId,
          },
        });
      } catch {
        // Ignore membership issues.
      }

      getRoomSet(roomId).add(socket.id);
      emitRoomPresence(roomId);
    });

    socket.on("leave-room", ({ roomId }: { roomId: string }) => {
      if (!roomId) return;
      socket.leave(roomId);
      getRoomSet(roomId).delete(socket.id);
      emitRoomPresence(roomId);
    });

    socket.on(
      "send-message",
      async (payload: {
        roomId: string;
        content?: string;
        imageUrl?: string;
        type?: "text" | "image";
      }) => {
        const { roomId, content, imageUrl, type } = payload;
        if (!roomId || (!content && !imageUrl)) {
          return;
        }

        const user = socket.data.user;
        const message = await prisma.message.create({
          data: {
            roomId,
            senderId: user.id,
            text: type === "image" ? content ?? null : content ?? null,
            image: imageUrl ?? null,
          },
          include: {
            sender: true,
          },
        });

        await prisma.room.update({
          where: { id: roomId },
          data: {
            lastMessage: content
              ? content
              : imageUrl
                ? "Sent an image"
                : "New message",
            lastActive: "Just now",
          },
        });

        io.to(roomId).emit("new-message", {
          id: message.id,
          roomId: message.roomId,
          userId: message.senderId,
          content: message.text,
          imageUrl: message.image,
          type: message.image ? "image" : "text",
          createdAt: message.createdAt,
          user: {
            id: message.sender.id,
            name: message.sender.name,
          },
        });
      },
    );

    socket.on("disconnect", () => {
      for (const roomId of socket.rooms) {
        if (roomId === socket.id) {
          continue;
        }
        getRoomSet(roomId).delete(socket.id);
        emitRoomPresence(roomId);
      }
    });
  });
}

export function getIo() {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
}
