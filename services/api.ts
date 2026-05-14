import { RoomCategory, RoomPrivacy } from "@/data/mock-chat";
import { create } from "axios";
import { Platform } from "react-native";

const LOCAL_API =
  Platform.OS === "android"
    ? "http://192.168.0.100:4000" // Android emulator
    : __DEV__
      ? "http://192.168.0.100:4000" // Development on simulator/web
      : "http://192.168.0.100:4000"; // Production or physical device - CHANGE THIS TO YOUR MACHINE'S IP
export const API_BASE_URL = LOCAL_API;

export const api = create({
  baseURL: API_BASE_URL,
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

export type Message = {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  text?: string;
  image?: string;
  createdAt: string;
  sentAt: string;
  isCurrentUser: boolean;
};

export async function loginRequest(email: string, password: string) {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data as { user: User; token: string };
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
) {
  const response = await api.post("/api/auth/register", {
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
  const response = await api.get(`/api/rooms?${params.toString()}`);
  return response.data as Room[];
}

export async function getRoomById(roomId: string) {
  const response = await api.get(`/api/rooms/${roomId}`);
  return response.data as Room;
}

export async function getRoomByCode(code: string) {
  const response = await api.get(`/api/rooms/code/${encodeURIComponent(code)}`);
  return response.data as Room;
}

export async function createRoom(data: RoomCreateInput) {
  const response = await api.post("/api/rooms", data);
  return response.data as Room;
}

export type ServerMessage = {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  text?: string;
  image?: string;
  createdAt: string;
};

export async function getRoomMessages(
  roomId: string,
): Promise<Omit<ServerMessage, "senderInitials">[]> {
  const response = await api.get(`/api/rooms/${roomId}/messages`);
  return response.data as Omit<ServerMessage, "senderInitials">[];
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

  const response = await api.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.url as string;
}
