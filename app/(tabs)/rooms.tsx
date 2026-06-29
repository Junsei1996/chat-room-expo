import { CategoryPill } from "@/components/ui/CategoryPill";
import { EmptyState } from "@/components/ui/EmptyState";
import { RoomCard } from "@/components/ui/RoomCard";
import { useAuth } from "@/context/auth-context";
import { useChatData } from "@/context/chat-context";
import { categories } from "@/data/mock-chat";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RoomsScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { rooms, loading, refreshRooms } = useChatData();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, router, user]);

  useEffect(() => {
    const handle = setTimeout(() => {
      refreshRooms(search, category);
    }, 300);
    return () => clearTimeout(handle);
  }, [search, category, refreshRooms]);

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Chat Rooms</Text>
          <Text style={styles.subtitle}>
            Browse live communities, find your next conversation, or join by
            code.
          </Text>
        </View>

        <View style={styles.searchCard}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search rooms"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          <CategoryPill
            label="All"
            selected={category === "All"}
            onPress={() => setCategory("All")}
          />
          {categories.map((item) => (
            <CategoryPill
              key={item}
              label={item}
              selected={category === item}
              onPress={() => setCategory(item)}
            />
          ))}
        </ScrollView>

        <View style={styles.statsRow}>
          <Text style={styles.statsText}>{rooms.length} rooms available</Text>
          <Pressable
            style={styles.actionTag}
            onPress={() => router.push("/join")}
          >
            <Ionicons name="key-outline" size={16} color="#fff" />
            <Text style={styles.actionLabel}>Join by code</Text>
          </Pressable>
        </View>

        {authLoading || (loading && rooms.length === 0) ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#fff" />
          </View>
        ) : rooms.length === 0 && !loading ? (
          <EmptyState
            icon="sad-outline"
            title="No rooms found"
            subtitle="Try a different search term or change the category filter."
            actionLabel="Reset search"
            onAction={() => {
              setSearch("");
              setCategory("All");
            }}
          />
        ) : (
          rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onPress={() => router.push(`/room/${room.id}`)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#070B1D",
  },
  container: {
    padding: 20,
    paddingBottom: 30,
    gap: 16,
  },
  header: {
    gap: 6,
    marginBottom: 18,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: "#A6B0C3",
    fontSize: 15,
    lineHeight: 22,
  },
  searchCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#11172B",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
  },
  filtersRow: {
    gap: 10,
    paddingTop: 14,
    paddingBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  statsText: {
    color: "#94A3B8",
    fontSize: 13,
  },
  actionTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#6C5CE7",
  },
  actionLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  loadingCard: {
    padding: 32,
    alignItems: "center",
  },
});

// const styles = StyleSheet.create({
//   page: {
//     flex: 1,
//     backgroundColor: "#070B1D",
//   },
//   container: {
//     padding: 20,
//     paddingBottom: 30,
//     gap: 16,
//   },
//   header: {
//     gap: 6,
//     marginBottom: 18,
//   },
//   title: {
//     color: "#fff",
//     fontSize: 30,
//     fontWeight: "800",
//   },
//   subtitle: {
//     color: "#A6B0C3",
//     fontSize: 15,
//     lineHeight: 22,
//   },
//   searchCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     padding: 16,
//     borderRadius: 18,
//     backgroundColor: "#11172B",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//   },
//   searchInput: {
//     flex: 1,
//     color: "#fff",
//     fontSize: 15,
//   },
//   filtersRow: {
//     gap: 10,
//     paddingTop: 14,
//     paddingBottom: 4,
//   },
//   statsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   statsText: {
//     color: "#94A3B8",
//     fontSize: 13,
//   },
//   actionTag: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 999,
//     backgroundColor: "#6C5CE7",
//   },
//   actionLabel: {
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: "700",
//   },
// });
