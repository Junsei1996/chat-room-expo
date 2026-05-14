import { ChatInput } from "@/components/ui/ChatInput";
import { Header } from "@/components/ui/Header";
import { MessageBubble } from "@/components/ui/MessageBubble";
import { useChatData } from "@/context/chat-context";
import { roomMessages } from "@/data/mock-chat";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function ChatRoomScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { findRoomById } = useChatData();
  const roomId = String(params.id ?? "");
  const room = findRoomById(roomId);
  const initialMessages = room ? (roomMessages[room.id] ?? []) : [];
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    if (room) {
      setMessages(roomMessages[room.id] ?? []);
    }
  }, [room]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }

    const newMessage = {
      id: `${Date.now()}`,
      roomId,
      senderName: "You",
      senderId: "u0",
      senderInitials: "Y",
      text: trimmed,
      sentAt: "Now",
      isCurrentUser: true,
    };

    setMessages((current) => [...current, newMessage]);
    setDraft("");

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 80);
  };

  const handleAttach = () => {
    Alert.alert("Image picker", "This is a mock picker UI only.");
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
      <View style={styles.headerWrapper}>
        <Header
          title={room.name}
          subtitle={`${room.online} online • ${room.privacy}`}
          onBack={() => router.back()}
          rightIcon="ellipsis-vertical"
          onRightPress={() =>
            Alert.alert("Room options", "Mock room options not implemented.")
          }
        />
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
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
});
