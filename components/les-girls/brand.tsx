import { Image, StyleSheet, View } from "react-native";

const brandLogo = require("../../assets/images/les-girls/brand-logo.png");

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <View className="items-center" accessibilityRole="image" accessibilityLabel="Les Girls">
      <Image
        source={brandLogo}
        resizeMode="contain"
        style={compact ? styles.compactLogo : styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  compactLogo: { width: 116, height: 42 },
  logo: { width: 270, height: 97 },
});
