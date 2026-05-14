import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

type ChatInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  onAttach?: () => void;
};

export function ChatInput({
  value,
  onChangeText,
  onSend,
  onAttach,
}: ChatInputProps) {
  const canSend = value.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.inputCard}>
        <Pressable
          style={styles.attachButton}
          onPress={onAttach}
          android_ripple={{ color: "rgba(255,255,255,0.08)" }}
        >
          <Ionicons name="image-outline" size={20} color="#A5B4FC" />
        </Pressable>
        <TextInput
          placeholder="Write a message..."
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          multiline
        />
      </View>
      <Pressable
        style={[
          styles.sendButton,
          canSend ? styles.sendButtonActive : styles.sendButtonDisabled,
        ]}
        onPress={onSend}
        disabled={!canSend}
        android_ripple={{ color: "rgba(255,255,255,0.08)" }}
      >
        <Ionicons name="send" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#10121B",
  },
  inputCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#171A2A",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(108, 92, 231, 0.12)",
  },
  input: {
    flex: 1,
    minHeight: 36,
    color: "#fff",
    fontSize: 15,
    maxHeight: 80,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonActive: {
    backgroundColor: "#6C5CE7",
  },
  sendButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
});
