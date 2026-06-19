import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function getRooms(req: Request, res: Response) {
  const search = String(req.query.search || "").trim();
  const category = String(req.query.category || "").trim();
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category && category !== "All") {
    where.category = category;
  }

  const rooms = await prisma.room.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json(rooms);
}

export async function getRoomByCode(req: Request, res: Response) {
  const code = String(req.params.code || "")
    .trim()
    .toUpperCase();
  const room = await prisma.room.findUnique({
    where: {
      code,
    },
  });

  if (!room) {
    return res.status(404).json({ error: "Room code not found" });
  }

  return res.json(room);
}

export async function getRoomById(req: Request, res: Response) {
  const roomId = String(req.params.id);
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  return res.json(room);
}

export async function getRoomMessages(req: Request, res: Response) {
  const roomId = String(req.params.id);
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  const messages = await prisma.message.findMany({
    where: {
      roomId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      sender: true,
    },
  });

  return res.json(
    messages.map((message) => ({
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
        email: message.sender.email,
      },
    })),
  );
}

export async function createRoom(req: Request, res: Response) {
  const { name, description, category, privacy } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!name || !description || !category || !privacy) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const code = `${name.trim().slice(0, 6).toUpperCase()}${Math.floor(
    Math.random() * 9000 + 1000,
  )}`;

  const room = await prisma.room.create({
    data: {
      name,
      description,
      category,
      privacy,
      code,
      lastMessage: "Room created and ready to join.",
      lastActive: "Just now",
      members: 1,
      online: 0,
    },
  });

  await prisma.roomMember.create({
    data: {
      roomId: room.id,
      userId,
    },
  });

  return res.status(201).json(room);
}
