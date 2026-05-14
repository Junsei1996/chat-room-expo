import { useAuth } from "@/context/auth-context";
import { Feather } from "@expo/vector-icons";
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

export default function LoginScreen() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, router, user]);

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(
        (err as any)?.response?.data?.error ||
          "Unable to sign in. Check your credentials.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue chatting in secure, real-time rooms.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputRow}>
            <Feather name="mail" color="#94A3B8" size={18} />
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="Email address"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputRow}>
            <Feather name="lock" color="#94A3B8" size={18} />
            <TextInput
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitting}
            android_ripple={{ color: "rgba(255,255,255,0.1)" }}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.submitLabel}>Sign in</Text>
                <Feather name="arrow-right" color="#fff" size={18} />
              </>
            )}
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to ChatFlow?</Text>
          <Pressable onPress={() => router.push("/register")}>
            <Text style={styles.footerLink}>Create your account</Text>
          </Pressable>
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
    justifyContent: "center",
    gap: 18,
  },
  hero: {
    gap: 10,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    color: "#A6B0C3",
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: "#11172E",
    borderRadius: 28,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "#10152D",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
  },
  errorText: {
    color: "#FB7185",
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "#6C5CE7",
  },
  submitLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  footerLink: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
