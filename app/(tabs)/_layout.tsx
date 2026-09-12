import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { FloatingTabBar } from "@/components/layout/floating-tab-bar";
import { tabItems } from "@/components/layout/navigation-data";
import { useLesGirls } from "@/lib/les-girls";

export default function TabsLayout() {
  const { loading, isAuthenticated, group } = useLesGirls();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }
  if (!isAuthenticated) return <Redirect href="/" />;
  if (!group) return <Redirect href="/group" />;

  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <FloatingTabBar {...props} />}>
      {tabItems.map((item) => (
        <Tabs.Screen key={item.name} name={item.name} options={{ title: item.title }} />
      ))}
      <Tabs.Screen name="profile" options={{ title: "Profil", href: null }} />
    </Tabs>
  );
}
