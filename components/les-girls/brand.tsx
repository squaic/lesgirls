import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { useTheme } from "@/theming/ThemeProvider";

const brandLogo = require("../../assets/images/les-girls/brand-logo.png");

export function Brand({ compact = false }: { compact?: boolean }) {
  const { theme } = useTheme();

  return (
    <View className="items-center" accessibilityRole="image" accessibilityLabel="Les Girls">
      <Image
        source={brandLogo}
        contentFit="contain"
        tintColor={theme.name === "dark" ? theme.colors.foreground : undefined}
        style={compact ? styles.compactLogo : styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  compactLogo: { width: 116, height: 41 },
  logo: { width: 270, height: 95 },
});
