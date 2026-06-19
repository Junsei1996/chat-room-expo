import { useAuth } from "@/context/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const settings = [
  {
    title: "Notifications",
    icon: "notifications-outline",
    route: "/notifications",
  },
  { title: "Theme", icon: "color-palette-outline", route: "/theme" },
  { title: "Privacy", icon: "shield-checkmark-outline", route: "/privacy" },
  { title: "Help", icon: "help-circle-outline", route: "/help" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>{user.email}</Text>
            <Text style={styles.bio} numberOfLines={3}>
              Secure chat with real rooms, image uploads, and live Socket.IO
              messaging.
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>Live</Text>
            <Text style={styles.statLabel}>Chat rooms</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>Online</Text>
            <Text style={styles.statLabel}>Presence ready</Text>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settings.map((item) => (
            <Pressable
              key={item.title}
              style={styles.settingItem}
              onPress={() => router.push(item.route as any)}
              android_ripple={{ color: "rgba(255,255,255,0.08)" }}
            >
              <View style={styles.settingIcon}>
                <Ionicons name={item.icon as any} size={20} color="#6C5CE7" />
              </View>
              <Text style={styles.settingTitle}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#A6B0C3" />
            </Pressable>
          ))}

          <Pressable
            style={styles.logoutButton}
            onPress={logout}
            android_ripple={{ color: "rgba(255,255,255,0.08)" }}
          >
            <Text style={styles.logoutLabel}>Sign out</Text>
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
    gap: 20,
  },
  profileCard: {
    backgroundColor: "#11172F",
    borderRadius: 28,
    padding: 20,
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 26,
    backgroundColor: "#312E81",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  profileDetails: {
    flex: 1,
    gap: 6,
  },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },
  username: {
    color: "#94A3B8",
    fontSize: 14,
  },
  bio: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#0E1733",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  statValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  statLabel: {
    color: "#94A3B8",
    marginTop: 8,
    fontSize: 13,
  },
  settingsCard: {
    backgroundColor: "#11172E",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#151C35",
    alignItems: "center",
    justifyContent: "center",
  },
  settingTitle: {
    flex: 1,
    color: "#E2E8F0",
    fontSize: 15,
    fontWeight: "700",
  },
  logoutButton: {
    marginTop: 18,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "#6C5CE7",
    alignItems: "center",
  },
  logoutLabel: {
    color: "#fff",
    fontWeight: "700",
  },
});
