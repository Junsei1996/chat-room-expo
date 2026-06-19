import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const notificationItems = [
  {
    label: "Message previews",
    description: "Show message snippets in notifications.",
  },
  {
    label: "Room mentions",
    description: "Receive a notification when someone mentions you.",
  },
  {
    label: "New room invites",
    description: "Get alerted when you are invited to a room.",
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, boolean>>({
    "Message previews": true,
    "Room mentions": true,
    "New room invites": false,
  });

  const toggleItem = (label: string) => {
    setSettings((current) => ({
      ...current,
      [label]: !current[label],
    }));
  };

  const handleBack = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.replace("/profile");
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            android_ripple={{ color: "rgba(255,255,255,0.08)" }}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.title}>Notifications</Text>
        </View>

        <Text style={styles.subtitle}>
          Control how ChatFlow alerts you about new messages, mentions, and
          room activity.
        </Text>

        <View style={styles.card}>
          {notificationItems.map((item) => (
            <Pressable
              key={item.label}
              style={styles.optionRow}
              onPress={() => toggleItem(item.label)}
              android_ripple={{ color: "rgba(255,255,255,0.08)" }}
            >
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>{item.label}</Text>
                <Text style={styles.optionDescription}>{item.description}</Text>
              </View>
              <View
                style={[
                  styles.toggle,
                  settings[item.label] && styles.toggleActive,
                ]}
              />
            </Pressable>
          ))}
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#11172F",
    borderRadius: 28,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  optionText: {
    flex: 1,
    gap: 4,
  },
  optionLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  optionDescription: {
    color: "#94A3B8",
    fontSize: 13,
  },
  toggle: {
    width: 42,
    height: 24,
    borderRadius: 999,
    backgroundColor: "#334155",
  },
  toggleActive: {
    backgroundColor: "#6C5CE7",
  },
});
