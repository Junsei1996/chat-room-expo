import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

type CategoryPillProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export function CategoryPill({
  label,
  selected = false,
  onPress,
}: CategoryPillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, selected && styles.selected]}
      android_ripple={{ color: "rgba(255,255,255,0.08)" }}
    >
      <Ionicons
        name="pricetag"
        size={12}
        color={selected ? "#fff" : "#8D98A6"}
      />
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  selected: {
    backgroundColor: "#6C5CE7",
    borderColor: "#6C5CE7",
  },
  label: {
    color: "#8D98A6",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  labelSelected: {
    color: "#fff",
  },
});
