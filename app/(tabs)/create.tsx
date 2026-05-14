import { CategoryPill } from "@/components/ui/CategoryPill";
import { useAuth } from "@/context/auth-context";
import { useChatData } from "@/context/chat-context";
import { categories, RoomCategory, RoomPrivacy } from "@/data/mock-chat";
import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function CreateRoomScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addRoom } = useChatData();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<RoomCategory>("Tech");
  const [privacy, setPrivacy] = useState<RoomPrivacy>("Public");
  const [confirmation, setConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      setConfirmation("Please complete the room name and description.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addRoom({
        name: name.trim(),
        description: description.trim(),
        category,
        privacy,
      });
      setConfirmation(`Room "${name.trim()}" created successfully.`);
      setName("");
      setDescription("");
    } catch (error) {
      setConfirmation("Unable to create room. Please try again.");
      console.warn(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authLoading && !user) {
    router.replace("/login");
    return null;
  }

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create a Room</Text>
        <Text style={styles.subtitle}>
          Build your own space for chats, groups, or study sessions.
        </Text>

        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Room name</Text>
          <TextInput
            style={styles.input}
            placeholder="Design feedback"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write a short room description"
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.fieldLabel}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersRow}
          >
            {categories.map((item) => (
              <CategoryPill
                key={item}
                label={item}
                selected={item === category}
                onPress={() => setCategory(item)}
              />
            ))}
          </ScrollView>

          <Text style={styles.fieldLabel}>Privacy</Text>
          <View style={styles.privacyRow}>
            {(["Public", "Private"] as RoomPrivacy[]).map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.privacyOption,
                  option === privacy && styles.privacySelected,
                ]}
                onPress={() => setPrivacy(option)}
                android_ripple={{ color: "rgba(255,255,255,0.08)" }}
              >
                <Text
                  style={[
                    styles.privacyLabel,
                    option === privacy && styles.privacyLabelSelected,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>

          {confirmation ? (
            <Text style={styles.confirmation}>{confirmation}</Text>
          ) : null}

          <Pressable
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
            android_ripple={{ color: "rgba(255,255,255,0.1)" }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitLabel}>Create room</Text>
            )}
          </Pressable>
        </View>
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
    gap: 18,
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
    backgroundColor: "#11172E",
    borderRadius: 28,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  fieldLabel: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  input: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#0E1329",
    color: "#fff",
    fontSize: 15,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  filtersRow: {
    gap: 10,
    paddingVertical: 6,
  },
  privacyRow: {
    flexDirection: "row",
    gap: 12,
  },
  privacyOption: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#11172D",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  privacySelected: {
    backgroundColor: "#6C5CE7",
    borderColor: "#6C5CE7",
  },
  privacyLabel: {
    color: "#E2E8F0",
    fontWeight: "700",
  },
  privacyLabelSelected: {
    color: "#fff",
  },
  confirmation: {
    color: "#86EFAC",
    fontWeight: "700",
    marginTop: 8,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "#6C5CE7",
    alignItems: "center",
  },
  submitLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
