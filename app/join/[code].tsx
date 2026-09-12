import { Redirect, router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Brand } from "@/components/les-girls/brand";
import { useLesGirls } from "@/lib/les-girls";

export default function JoinGroupScreen() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const { loading, isAuthenticated, joinGroup } = useLesGirls();
  const [joining, setJoining] = React.useState(false);
  const [error, setError] = React.useState("");
  const attempted = React.useRef(false);

  React.useEffect(() => {
    if (loading || !isAuthenticated || !code || attempted.current) return;
    attempted.current = true;
    setJoining(true);
    joinGroup(code)
      .then(() => router.replace("/(tabs)"))
      .catch((cause) => {
        setError(cause instanceof Error ? cause.message : "Invitation invalide.");
        setJoining(false);
      });
  }, [code, isAuthenticated, joinGroup, loading]);

  if (!loading && !isAuthenticated) {
    return <Redirect href={{ pathname: "/", params: { invite: code || "" } }} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background px-7">
      <View className="mx-auto flex-1 w-full max-w-sm items-center justify-center">
        <Brand />
        {joining || loading ? (
          <>
            <ActivityIndicator className="mt-10" />
            <Text className="mt-4 text-center text-sm text-muted-foreground">
              Nous ouvrons votre invitation…
            </Text>
          </>
        ) : error ? (
          <>
            <Text className="mt-10 text-center text-h3 text-foreground">Invitation introuvable</Text>
            <Text className="mt-3 text-center text-sm leading-6 text-muted-foreground">{error}</Text>
            <Pressable
              onPress={() => router.replace("/group")}
              className="mt-7 h-14 w-full items-center justify-center rounded-full bg-primary"
            >
              <Text className="text-button text-primary-foreground">Saisir un autre lien</Text>
            </Pressable>
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
