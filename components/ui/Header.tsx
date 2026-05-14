import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type HeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export function Header({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
}: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.leftColumn}>
        {onBack ? (
          <Pressable
            style={styles.iconButton}
            onPress={onBack}
            android_ripple={{ color: "rgba(255,255,255,0.1)" }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
        ) : null}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {rightIcon ? (
        <Pressable
          style={styles.iconButton}
          onPress={onRightPress}
          android_ripple={{ color: "rgba(255,255,255,0.1)" }}
        >
          <Ionicons name={rightIcon} size={24} color="#fff" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  leftColumn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    gap: 4,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },
  subtitle: {
    color: "#B8C0CC",
    fontSize: 13,
  },
});
