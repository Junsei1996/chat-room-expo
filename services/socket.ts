import { io, type Socket } from "socket.io-client";
import { API_BASE_URL, type Message } from "@/services/api";

type ClientToServerEvents = {
  "join-room": (payload: { roomId: string }) => void;
  "leave-room": (payload: { roomId: string }) => void;
  "send-message": (payload: {
    roomId: string;
    content?: string;
    imageUrl?: string;
    type: "text" | "image";
  }) => void;
};

type ServerToClientEvents = {
  "new-message": (message: Message) => void;
  "room-presence": (payload: { roomId: string; onlineCount: number }) => void;
};

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
let currentToken: string | null = null;

export function getSocket(token: string) {
  if (socket && currentToken === token) {
    return socket;
  }

  disconnectSocket();
  currentToken = token;
  socket = io(API_BASE_URL, {
    transports: ["websocket"],
    auth: { token },
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = null;
  }
}
