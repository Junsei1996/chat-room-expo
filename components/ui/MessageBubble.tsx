import { Image, StyleSheet, Text, View } from "react-native";

type ChatMessage = {
  id: string;
  roomId: string;
  userId: string;
  content?: string | null;
  imageUrl?: string | null;
  type: "text" | "image";
  createdAt: string;
  user: {
    id: string;
    name: string;
    username?: string;
  };
  isCurrentUser?: boolean;
};

type MessageBubbleProps = {
  message: ChatMessage;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function formatTimestamp(value: string) {
  try {
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isCurrentUser = message.isCurrentUser ?? false;
  const initials = getInitials(message.user.name);
  const text = message.content;
  const timestamp = formatTimestamp(message.createdAt);

  return (
    <View
      style={[
        styles.container,
        isCurrentUser ? styles.containerRight : styles.containerLeft,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.bubbleRight : styles.bubbleLeft,
        ]}
      >
        {!isCurrentUser ? (
          <Text style={styles.sender}>{message.user.name}</Text>
        ) : null}
        {message.type === "text" && text ? (
          <Text
            style={[
              styles.messageText,
              isCurrentUser ? styles.textRight : styles.textLeft,
            ]}
          >
            {text}
          </Text>
        ) : null}
        {message.type === "image" && message.imageUrl ? (
          <Image source={{ uri: message.imageUrl }} style={styles.messageImage} />
        ) : null}
        <Text
          style={[
            styles.timestamp,
            isCurrentUser ? styles.timestampRight : styles.timestampLeft,
          ]}
        >
          {timestamp}
        </Text>
      </View>
      <View
        style={[
          styles.avatar,
          isCurrentUser ? styles.avatarRight : styles.avatarLeft,
        ]}
      >
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
    gap: 12,
  },
  containerLeft: {
    justifyContent: "flex-start",
  },
  containerRight: {
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "78%",
    borderRadius: 22,
    padding: 14,
    backgroundColor: "#252B43",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
  },
  bubbleLeft: {
    borderTopLeftRadius: 4,
  },
  bubbleRight: {
    backgroundColor: "#4F46E5",
    borderTopRightRadius: 4,
  },
  sender: {
    color: "#D8D4FE",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textLeft: {
    color: "#E2E8F0",
  },
  textRight: {
    color: "#fff",
  },
  messageImage: {
    width: 220,
    height: 140,
    borderRadius: 18,
    marginTop: 10,
    backgroundColor: "#111827",
  },
  timestamp: {
    marginTop: 10,
    fontSize: 12,
  },
  timestampLeft: {
    color: "#94A3B8",
    textAlign: "left",
  },
  timestampRight: {
    color: "#D8D4FE",
    textAlign: "right",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#312E81",
  },
  avatarLeft: {
    marginRight: 4,
  },
  avatarRight: {
    marginLeft: 4,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
  },
});
