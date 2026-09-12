const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

module.exports = {
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/les-girls/app-icon.png",
      backgroundColor: "#FFFDF9",
    },
    package: "com.lesgirls.app",
  },
  assetBundlePatterns: ["**/*"],
  experiments: { typedRoutes: true, tsconfigPaths: true },
  icon: "./assets/images/les-girls/app-icon.png",
  ios: { supportsTablet: true, bundleIdentifier: "com.lesgirls.app" },
  name: "Les Girls",
  orientation: "portrait",
  plugins: ["expo-asset", "expo-image", "expo-router"],
  scheme: "les-girls",
  slug: "les-girls",
  splash: {
    image: "./assets/images/les-girls/app-icon.png",
    resizeMode: "contain",
    backgroundColor: "#FFFDF9",
  },
  userInterfaceStyle: "light",
  version: "1.0.0",
  web: { bundler: "metro", output: "single", favicon: "./assets/images/les-girls/app-icon.png" },
  platforms: ["ios", "android", "web"],
  extra: { supabaseUrl, supabaseAnonKey },
};
