import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Brand } from "@/components/les-girls/brand";

export default function NotFoundScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background px-7">
      <View className="mx-auto flex-1 w-full max-w-sm items-center justify-center">
        <Brand />
        <Text className="mt-8 text-center text-h2 text-foreground">Page introuvable</Text>
        <Text className="mt-3 text-center text-sm leading-6 text-muted-foreground">
          Cette page n’existe pas ou n’est plus disponible.
        </Text>
        <Pressable
          onPress={() => router.replace("/")}
          className="mt-7 h-14 w-full items-center justify-center rounded-full bg-primary"
        >
          <Text className="text-button text-primary-foreground">Retour à Les Girls</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
