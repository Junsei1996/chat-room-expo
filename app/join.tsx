import { useAuth } from "@/context/auth-context";
import { getRoomByCode } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JoinRoomScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  const handleJoin = async () => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setStatus({ type: "error", message: "Please enter a room code." });
      return;
    }

    setLoadingState(true);
    setStatus({ type: "idle", message: "" });

    try {
      const room = await getRoomByCode(normalized);
      setStatus({ type: "success", message: `Joining ${room.name}…` });
      router.push(`/room/${room.id}`);
    } catch {
      setStatus({
        type: "error",
        message: "Room code not found. Try another code.",
      });
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Join Room</Text>
          <Text style={styles.subtitle}>
            Enter a room code to access a private or public chat.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputRow}>
            <Ionicons name="key-outline" size={18} color="#94A3B8" />
            <TextInput
              style={styles.input}
              placeholder="Enter room code"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              value={code}
              onChangeText={setCode}
            />
          </View>

          {status.message ? (
            <Text
              style={[
                styles.statusMessage,
                status.type === "error" ? styles.errorText : styles.successText,
              ]}
            >
              {status.message}
            </Text>
          ) : null}

          <Pressable
            style={styles.joinButton}
            onPress={handleJoin}
            disabled={loadingState}
            android_ripple={{ color: "rgba(255,255,255,0.1)" }}
          >
            {loadingState ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.joinLabel}>Validate code</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Tips</Text>
          <Text style={styles.infoText}>
            Room codes are shown on each room card and shared by the room
            creator. Codes are not case sensitive.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#070B1D",
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 18,
  },
  header: {
    gap: 8,
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
  card: {
    backgroundColor: "#141B36",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 14,
  },
  inputRow: {
    backgroundColor: "#10152D",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },
  statusMessage: {
    marginTop: 2,
    fontSize: 14,
  },
  errorText: {
    color: "#FB7185",
  },
  successText: {
    color: "#86EFAC",
  },
  joinButton: {
    marginTop: 6,
    backgroundColor: "#6C5CE7",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  joinLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  infoCard: {
    marginTop: 4,
    padding: 20,
    borderRadius: 24,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  infoTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  infoText: {
    color: "#A6B0C3",
    lineHeight: 22,
  },
});
