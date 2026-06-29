import { RoomCategory, RoomPrivacy } from "@/data/mock-chat";
import axios from "axios";

// Local LAN address used during development (simulator / device on same network).
// Change this to your machine's IP when testing on a physical device.
const DEV_API_URL = "http://192.168.0.105:4000";

// In production builds set EXPO_PUBLIC_API_URL to your deployed backend URL
// (e.g. https://api.yourdomain.com). It is inlined by Expo at build time.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? DEV_API_URL;

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Room = {
  id: string;
  name: string;
  description: string;
  category: RoomCategory;
  members: number;
  online: number;
  lastMessage: string;
  lastActive: string;
  code: string;
  privacy: RoomPrivacy;
};

export type RoomCreateInput = {
  name: string;
  description: string;
  category: RoomCategory;
  privacy: RoomPrivacy;
};

export type MessageUser = {
  id: string;
  name: string;
  username?: string;
};

export type Message = {
  id: string;
  roomId: string;
  userId: string;
  content?: string | null;
  imageUrl?: string | null;
  type: "text" | "image";
  createdAt: string;
  user: MessageUser;
  isCurrentUser?: boolean;
};

export async function loginRequest(email: string, password: string) {
  const response = await api.post("/auth/login", { email, password });
  return response.data as { user: User; token: string };
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
) {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
  });
  return response.data as { user: User; token: string };
}

export async function getRooms(search?: string, category?: string) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category && category !== "All") params.set("category", category);
  const response = await api.get(`/rooms?${params.toString()}`);
  return response.data as Room[];
}

export async function getRoomById(roomId: string) {
  const response = await api.get(`/rooms/${roomId}`);
  return response.data as Room;
}

export async function getRoomByCode(code: string) {
  const response = await api.get(`/rooms/code/${encodeURIComponent(code)}`);
  return response.data as Room;
}

export async function createRoom(data: RoomCreateInput) {
  const response = await api.post("/rooms", data);
  return response.data as Room;
}

export async function getRoomMessages(roomId: string) {
  const response = await api.get(`/rooms/${roomId}/messages`);
  return response.data as Message[];
}

export async function uploadImage(uri: string) {
  const formData = new FormData();
  const fileName = uri.split("/").pop() || "image.jpg";
  const fileType = `image/${fileName.split(".").pop() ?? "jpg"}`;

  formData.append("image", {
    uri,
    name: fileName,
    type: fileType,
  } as any);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.url as string;
}
