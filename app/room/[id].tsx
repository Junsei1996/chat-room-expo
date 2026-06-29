import { ChatInput } from "@/components/ui/ChatInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { Header } from "@/components/ui/Header";
import { MessageBubble } from "@/components/ui/MessageBubble";
import { useAuth } from "@/context/auth-context";
import { useChatData } from "@/context/chat-context";
import { getRoomMessages, Message, uploadImage } from "@/services/api";
import { getSocket } from "@/services/socket";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatRoomScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, token, loading: authLoading } = useAuth();
  const { findRoomById } = useChatData();
  const roomId = String(params.id ?? "");
  const room = findRoomById(roomId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, router, user]);

  useEffect(() => {
    if (!room || !token) {
      return;
    }

    let isMounted = true;
    // Reset UI for the new room before fetching its message history.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingMessages(true);
    setStatusMessage(null);
    setOnlineCount(null);

    getRoomMessages(roomId)
      .then((data) => {
        if (!isMounted) return;
        setMessages(
          data.map((message) => ({
            ...message,
            isCurrentUser: message.userId === user?.id,
          })),
        );
      })
      .catch(() => {
        if (!isMounted) return;
        setStatusMessage("Unable to load messages. Please try again.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoadingMessages(false);
      });

    return () => {
      isMounted = false;
    };
  }, [room, roomId, token, user?.id]);

  useEffect(() => {
    if (!room || !token) {
      return;
    }

    const socket = getSocket(token);
    socketRef.current = socket;

    const handleNewMessage = (message: Message) => {
      setMessages((current) => {
        if (current.some((item) => item.id === message.id)) {
          return current;
        }

        return [
          ...current,
          {
            ...message,
            isCurrentUser: message.userId === user?.id,
          },
        ];
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 80);
    };

    const handleRoomPresence = (payload: {
      roomId: string;
      onlineCount: number;
    }) => {
      if (payload.roomId === roomId) {
        setOnlineCount(payload.onlineCount);
      }
    };

    socket.on("new-message", handleNewMessage);
    socket.on("room-presence", handleRoomPresence);
    socket.emit("join-room", { roomId });

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("room-presence", handleRoomPresence);
      socket.emit("leave-room", { roomId });
    };
  }, [room, roomId, token, user?.id]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed || !socketRef.current) {
      return;
    }

    socketRef.current.emit("send-message", {
      roomId,
      type: "text",
      content: trimmed,
    });
    setDraft("");
  };

  const handleAttach = async () => {
    if (!socketRef.current) {
      setStatusMessage("Unable to attach image. Please try again.");
      return;
    }

    // Ensure the native ImagePicker module is available in this environment
    if (!ImagePicker || typeof ImagePicker.requestMediaLibraryPermissionsAsync !== "function") {
      setStatusMessage(
        "Image picker is unavailable in this environment. Run on a device or ensure expo-image-picker is installed in your dev client.",
      );
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setStatusMessage("Photo permission is required to attach images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsEditing: false,
    });

    const canceled =
      ("canceled" in result && result.canceled) ||
      ("cancelled" in result && result.cancelled);
    if (canceled) {
      return;
    }

    const asset = Array.isArray((result as any).assets)
      ? (result as any).assets[0]
      : null;
    const uri = asset?.uri ?? (result as any).uri;

    if (!uri) {
      setStatusMessage("Unable to read selected image.");
      return;
    }

    setStatusMessage(null);

    try {
      const imageUrl = await uploadImage(uri);
      socketRef.current.emit("send-message", {
        roomId,
        type: "image",
        imageUrl,
      });
    } catch {
      setStatusMessage("Image upload failed. Please try again.");
    }
  };

  const handleBack = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.replace("/rooms");
    }
  };

  if (!room) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.missingContainer}>
          <Text style={styles.missingTitle}>Room not found</Text>
          <Text style={styles.missingSubtitle}>
            The chat room may have been removed or the link is invalid.
          </Text>
          <Pressable
            style={styles.backButton}
            onPress={() => router.push("/rooms")}
          >
            <Text style={styles.backLabel}>Back to rooms</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={[styles.headerWrapper, { paddingTop: 12 + insets.top }]}> 
        <Header
          title={room.name}
          subtitle={`${onlineCount ?? room.online} online • ${room.privacy}`}
          onBack={handleBack}
          rightIcon="ellipsis-vertical"
          onRightPress={() =>
            setStatusMessage("Room options are not available yet.")
          }
        />
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100 + insets.top}
      >
        {loadingMessages ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#fff" />
          </View>
        ) : messages.length === 0 ? (
          <ScrollView
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
          >
            <EmptyState
              icon="chatbubbles-outline"
              title="No messages yet"
              subtitle="Start the conversation in this room."
            />
          </ScrollView>
        ) : (
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              scrollRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </ScrollView>
        )}

        {statusMessage ? (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{statusMessage}</Text>
          </View>
        ) : null}

        <ChatInput
          value={draft}
          onChangeText={setDraft}
          onSend={handleSend}
          onAttach={handleAttach}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#070B1D",
  },
  flex: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  messageList: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },
  missingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 14,
  },
  missingTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  missingSubtitle: {
    color: "#94A3B8",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
    backgroundColor: "#6C5CE7",
  },
  backLabel: {
    color: "#fff",
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statusContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  statusText: {
    color: "#FBCFE8",
    fontSize: 13,
    textAlign: "center",
  },
});
