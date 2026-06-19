import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const themeOptions = [
  {
    label: "System default",
    description: "Use your device color scheme for app colors.",
  },
  {
    label: "Light",
    description: "Always use a bright app appearance.",
  },
  {
    label: "Dark",
    description: "Use a dark, low-light-friendly interface.",
  },
];

export default function ThemeScreen() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("System default");

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
          <Text style={styles.title}>Theme</Text>
        </View>

        <Text style={styles.subtitle}>
          Choose how ChatFlow displays colors and contrast across the app.
        </Text>

        <View style={styles.card}>
          {themeOptions.map((option) => (
            <Pressable
              key={option.label}
              style={styles.optionRow}
              onPress={() => setSelectedOption(option.label)}
              android_ripple={{ color: "rgba(255,255,255,0.08)" }}
            >
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <View
                style={[
                  styles.radio,
                  selectedOption === option.label && styles.radioActive,
                ]}
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Note</Text>
          <Text style={styles.infoText}>
            Theme selection is stored locally while this screen is open. System
            theme remains active across the app unless custom theme state is
            added globally.
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
  radio: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#475569",
  },
  radioActive: {
    borderColor: "#6C5CE7",
    backgroundColor: "#6C5CE7",
  },
  infoCard: {
    backgroundColor: "#11172F",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  infoTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },
  infoText: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 20,
  },
});
