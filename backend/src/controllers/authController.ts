import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

function createToken(user: { id: string; name: string; email: string }) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = createToken({
    id: user.id,
    name: user.name,
    email: user.email,
  });
  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = createToken({
    id: user.id,
    name: user.name,
    email: user.email,
  });
  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  });
}
