import { Redirect, router } from "expo-router";
import * as React from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Brand } from "@/components/les-girls/brand";
import Icon from "@/lib/icons/LucideIcon";
import { useLesGirls } from "@/lib/les-girls";

export default function GroupScreen() {
  const { loading, isAuthenticated, group, createGroup, joinGroup, signOut } = useLesGirls();
  const [mode, setMode] = React.useState<"create" | "join">("join");
  const [groupName, setGroupName] = React.useState("Les Girls");
  const [invite, setInvite] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  if (!loading && !isAuthenticated) return <Redirect href="/" />;
  if (!loading && group) return <Redirect href="/(tabs)" />;

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      if (mode === "create") await createGroup(groupName);
      else await joinGroup(invite);
      router.replace("/(tabs)");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible de rejoindre ce groupe.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="mx-auto flex-1 w-full max-w-lg px-7 pb-7 pt-10"
      >
        <View className="items-center">
          <Brand compact />
          <Text className="mt-10 text-center text-h1 leading-[41px] text-foreground">Votre petit cercle</Text>
          <Text className="mt-3 max-w-sm text-center text-[15px] leading-6 text-muted-foreground">
            Rejoignez le groupe privé de vos amies, ou créez le vôtre.
          </Text>
        </View>

        <View className="mt-10 flex-row rounded-full bg-secondary p-1">
          <Pressable onPress={() => { setMode("join"); setError(""); }} className={`h-11 flex-1 items-center justify-center rounded-full ${mode === "join" ? "bg-card" : ""}`}>
            <Text className={mode === "join" ? "font-semibold text-foreground" : "text-muted-foreground"}>Rejoindre</Text>
          </Pressable>
          <Pressable onPress={() => { setMode("create"); setError(""); }} className={`h-11 flex-1 items-center justify-center rounded-full ${mode === "create" ? "bg-card" : ""}`}>
            <Text className={mode === "create" ? "font-semibold text-foreground" : "text-muted-foreground"}>Créer</Text>
          </Pressable>
        </View>

        <View className="mt-8 gap-2">
          <Text className="text-sm font-semibold text-foreground">{mode === "create" ? "Nom du groupe" : "Lien ou code d’invitation"}</Text>
          {mode === "create" ? (
            <TextInput value={groupName} onChangeText={setGroupName} maxLength={80} placeholder="Les Girls" placeholderTextColor="#8A7D79" className="h-14 rounded-2xl border border-border bg-card px-4 text-base text-foreground" />
          ) : (
            <TextInput value={invite} onChangeText={setInvite} autoCapitalize="none" autoCorrect={false} placeholder="Collez le lien reçu" placeholderTextColor="#8A7D79" className="h-14 rounded-2xl border border-border bg-card px-4 text-base text-foreground" />
          )}
        </View>

        {error ? <Text className="mt-4 text-sm leading-5 text-destructive">{error}</Text> : null}

        <Pressable disabled={busy || loading} onPress={submit} className="mt-7 h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary active:opacity-85 disabled:opacity-50">
          <Text className="text-button text-primary-foreground">{busy ? "Un instant…" : mode === "create" ? "Créer notre groupe" : "Rejoindre le groupe"}</Text>
          <Icon name="ArrowUpRight" size={18} className="text-primary-foreground" />
        </Pressable>

        <Pressable onPress={async () => { await signOut(); router.replace("/"); }} className="mt-auto py-4">
          <Text className="text-center text-sm text-muted-foreground">Se déconnecter</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
