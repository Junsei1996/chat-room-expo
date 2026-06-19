import { useAuth } from "@/context/auth-context";
import { createRoom, getRooms, Room, RoomCreateInput } from "@/services/api";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

type ChatContextValue = {
  rooms: Room[];
  loading: boolean;
  refreshRooms: (search?: string, category?: string) => Promise<void>;
  addRoom: (room: RoomCreateInput) => Promise<void>;
  findRoomById: (id: string) => Room | undefined;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatDataProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshRooms = useCallback(
    async (search?: string, category?: string) => {
      if (!token) {
        setRooms([]);
        return;
      }

      setLoading(true);
      try {
        const data = await getRooms(search, category);
        setRooms(data);
      } catch (error) {
        console.warn("Error loading rooms", error);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const addRoom = useCallback(async (room: RoomCreateInput) => {
    const createdRoom = await createRoom(room);
    setRooms((current) => [createdRoom, ...current]);
  }, []);

  useEffect(() => {
    if (token) {
      refreshRooms();
    }
  }, [token, refreshRooms]);

  const findRoomById = useCallback(
    (id: string) => rooms.find((room) => room.id === id),
    [rooms],
  );

  const value = useMemo(
    () => ({ rooms, loading, refreshRooms, addRoom, findRoomById }),
    [rooms, loading, refreshRooms, addRoom, findRoomById],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatData() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatData must be used inside ChatDataProvider");
  }
  return context;
}
