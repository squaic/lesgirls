import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tabItems } from "@/components/layout/navigation-data";
import Icon from "@/lib/icons/LucideIcon";

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 bottom-0 items-center px-3"
      style={{ paddingBottom: Math.max(insets.bottom, 10) }}
    >
      <View className="h-[66px] w-full max-w-lg flex-row items-center justify-around rounded-full border border-border bg-card px-1 shadow-lg shadow-foreground/10">
        {tabItems.map((item) => {
          const index = state.routes.findIndex((route) => route.name === item.name);
          const route = state.routes[index];
          if (!route) return null;
          const isFocused = state.index === index;
          return (
            <Pressable
              key={item.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={item.title}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
              className={
                item.primary
                  ? "h-14 w-14 items-center justify-center rounded-full bg-[#423234]"
                  : "h-11 flex-1 items-center justify-center"
              }
            >
              <Icon
                name={item.icon}
                size={item.primary ? 27 : 22}
                strokeWidth={isFocused ? 2.4 : 1.7}
                className={
                  item.primary
                    ? "text-white"
                    : isFocused
                      ? "text-foreground"
                      : "text-muted-foreground"
                }
              />
              {!item.primary && isFocused ? (
                <View className="absolute bottom-1.5 h-1 w-1 rounded-full bg-foreground" />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
