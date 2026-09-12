import "@/global.css";
import "@/appearance-polyfill";

import {
  DefaultTheme as NavigationDefaultTheme,
  Theme as NavigationTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";

import { LesGirlsProvider } from "@/lib/les-girls";
import { ThemeProvider, useTheme } from "@/theming/ThemeProvider";
import lightTheme from "@/theming/themes/light";

export { ErrorBoundary } from "expo-router";

function RootContent() {
  const { theme } = useTheme();

  React.useEffect(() => {
    if (Platform.OS === "web") globalThis.document?.documentElement.classList.add("bg-background");
  }, []);

  const navigationTheme: NavigationTheme = React.useMemo(
    () => ({
      ...NavigationDefaultTheme,
      colors: {
        ...NavigationDefaultTheme.colors,
        background: theme.colors.background,
        border: theme.colors.border,
        card: theme.colors.card,
        notification: theme.colors.notification,
        primary: theme.colors.primary,
        text: theme.colors.foreground,
      },
    }),
    [theme],
  );

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StatusBar style="dark" />
      <LesGirlsProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ title: "Connexion" }} />
          <Stack.Screen name="group" options={{ title: "Votre groupe" }} />
          <Stack.Screen name="join/[code]" options={{ title: "Invitation" }} />
          <Stack.Screen name="(tabs)" options={{ title: "Les Girls" }} />
          <Stack.Screen name="+not-found" options={{ title: "Page introuvable" }} />
        </Stack>
      </LesGirlsProvider>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider initialThemeName="light" themes={[lightTheme]}>
      <RootContent />
    </ThemeProvider>
  );
}
