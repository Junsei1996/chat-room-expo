import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const helpUrl = "https://www.helpscout.com/helpu/";

export default function HelpScreen() {
  const router = useRouter();

  const openHelpPage = async () => {
    await WebBrowser.openBrowserAsync(helpUrl);
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
          <Text style={styles.title}>Help</Text>
        </View>

        <Text style={styles.subtitle}>
          Find support articles, tips, and answers for using ChatFlow.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Help resources</Text>
          <Text style={styles.text}>
            Need help with rooms, notifications, or account settings? Our hosted
            support page is available with step-by-step guides and troubleshooting.
          </Text>
          <Text style={styles.text}>
            Tap below to open the full help center in your browser.
          </Text>

          <Pressable
            style={styles.button}
            onPress={openHelpPage}
            android_ripple={{ color: "rgba(255,255,255,0.08)" }}
          >
            <Text style={styles.buttonText}>Open hosted help center</Text>
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
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  text: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    marginTop: 12,
    backgroundColor: "#6C5CE7",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
