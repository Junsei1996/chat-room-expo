import { useAuth } from "@/context/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const quickActions = [
  { label: "Explore Rooms", route: "/rooms", icon: "chatbubble-ellipses" },
  { label: "Create Room", route: "/create", icon: "add-circle" },
  { label: "Join Room", route: "/join", icon: "key" },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.title}>Welcome to ChatFlow</Text>
          <Text style={styles.subtitle}>
            Create rooms, join communities, and send messages instantly with a
            secure backend.
          </Text>
          <View style={styles.ctaGrid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.label}
                style={styles.ctaCard}
                onPress={() => router.push(action.route as any)}
                android_ripple={{ color: "rgba(255,255,255,0.08)" }}
              >
                <View style={styles.ctaIcon}>
                  <Ionicons
                    name={action.icon as any}
                    size={20}
                    color="#6C5CE7"
                  />
                </View>
                <Text style={styles.ctaLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.metricsCard}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>Live rooms</Text>
            <Text style={styles.metricLabel}>Browse active communities</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>Secure</Text>
            <Text style={styles.metricLabel}>JWT authentication</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>Real-time</Text>
            <Text style={styles.metricLabel}>Socket.IO chat updates</Text>
          </View>
        </View>

        <View style={styles.footerCard}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <Text style={styles.footerText}>
            Sign in to browse rooms, join private codes, and send messages with
            live updates and image uploads.
          </Text>
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heroCard: {
    borderRadius: 28,
    padding: 24,
    backgroundColor: "#121833",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    gap: 18,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40,
  },
  subtitle: {
    color: "#A6B0C3",
    fontSize: 16,
    lineHeight: 24,
  },
  ctaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  ctaCard: {
    flex: 1,
    minWidth: "30%",
    padding: 16,
    borderRadius: 20,
    backgroundColor: "rgba(108,92,231,0.12)",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  ctaIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#1B1F40",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaLabel: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  metricsCard: {
    borderRadius: 28,
    backgroundColor: "#0D132F",
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metricItem: {
    alignItems: "center",
  },
  metricValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  metricLabel: {
    color: "#9CA3AF",
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
  },
  footerCard: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: "#11172D",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  footerText: {
    color: "#A6B0C3",
    lineHeight: 22,
  },
});
