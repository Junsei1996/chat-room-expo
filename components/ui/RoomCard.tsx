import { Room } from "@/data/mock-chat";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type RoomCardProps = {
  room: Room;
  onPress: () => void;
};

export function RoomCard({ room, onPress }: RoomCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{room.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {room.description}
          </Text>
        </View>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeLabel}>{room.category}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="people" size={16} color="#A5B4FC" />
          <Text style={styles.statText}>{room.online} online</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="chatbubble-ellipses" size={16} color="#A5B4FC" />
          <Text style={styles.statText}>{room.members} members</Text>
        </View>
      </View>

      <Text style={styles.lastMessage} numberOfLines={1}>
        {room.lastMessage}
      </Text>

      <Pressable
        style={styles.actionButton}
        onPress={onPress}
        android_ripple={{ color: "rgba(255,255,255,0.1)" }}
      >
        <Text style={styles.actionText}>
          {room.privacy === "Private" ? "Request Access" : "Join"}{" "}
        </Text>
        <Ionicons name="chevron-forward" size={18} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    backgroundColor: "#1E2032",
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 14,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  description: {
    color: "#9CA3AF",
    marginTop: 6,
    lineHeight: 20,
  },
  badgeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#312E81",
  },
  badgeLabel: {
    color: "#D8D4FE",
    fontSize: 12,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    color: "#CBD5E1",
    fontSize: 13,
  },
  lastMessage: {
    color: "#B8C0CC",
    marginBottom: 18,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "#4F46E5",
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
});
