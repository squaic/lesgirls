import { Image } from "expo-image";
import { router } from "expo-router";
import * as React from "react";
import { Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Icon from "@/lib/icons/LucideIcon";
import { useLesGirls } from "@/lib/les-girls";

function memberSince(iso?: string | null) {
  if (!iso) return "";
  const value = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(
    new Date(iso),
  );
  return value.charAt(0).toLowerCase() + value.slice(1);
}

export default function ProfileScreen() {
  const { firstName, user, group, joinedAt, memberCount, recommendations, signOut } = useLesGirls();
  const [shareMessage, setShareMessage] = React.useState("");
  const mine = recommendations.filter((item) => item.userId === user?.id);
  const friends = Math.max(memberCount - 1, 0);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  };

  const logout = async () => {
    await signOut();
    router.replace("/");
  };

  const shareInvite = async () => {
    if (!group) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const inviteUrl = origin ? `${origin}/join/${group.invite_code}` : group.invite_code;
    const text = `Rejoins ${group.name} sur Les Girls : ${inviteUrl}`;

    try {
      if (Platform.OS === "web" && typeof navigator !== "undefined") {
        if (navigator.share) await navigator.share({ title: "Les Girls", text, url: inviteUrl });
        else if (navigator.clipboard) {
          await navigator.clipboard.writeText(inviteUrl);
          setShareMessage("Lien d’invitation copié.");
        }
      } else {
        await Share.share({ message: text });
      }
    } catch {
      // Cancelling a share sheet should not surface as an error.
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="mx-auto w-full max-w-lg px-5 pb-32"
      >
        <View className="flex-row items-center justify-between py-2">
          <Pressable
            onPress={goBack}
            accessibilityLabel="Retour"
            className="h-11 w-11 items-center justify-center rounded-full border border-border bg-card"
          >
            <Icon name="ChevronLeft" size={22} className="text-foreground" />
          </Pressable>
          <Text className="text-base font-semibold text-foreground">Profil</Text>
          <View className="h-11 w-11" />
        </View>

        <View className="items-center pb-8 pt-8">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-primary">
            <Text className="text-h1 text-primary-foreground">
              {firstName.slice(0, 1).toUpperCase()}
            </Text>
          </View>
          <Text className="mt-5 text-h2 text-foreground">{firstName}</Text>
          {joinedAt ? (
            <Text className="mt-1 text-sm text-muted-foreground">
              Membre depuis {memberSince(joinedAt)}
            </Text>
          ) : null}
        </View>

        <View className="flex-row rounded-3xl bg-secondary px-2 py-5">
          {[
            { label: "partages", value: mine.length },
            { label: "amies", value: friends },
            { label: "recos", value: recommendations.length },
          ].map((stat, index) => (
            <View
              key={stat.label}
              className={
                index < 2 ? "flex-1 items-center border-r border-border" : "flex-1 items-center"
              }
            >
              <Text className="text-xl font-semibold text-secondary-foreground">{stat.value}</Text>
              <Text className="mt-1 text-xs text-muted-foreground">{stat.label}</Text>
            </View>
          ))}
        </View>

        <View className="mb-4 mt-9 flex-row items-end justify-between">
          <View>
            <Text className="text-h3 text-foreground">Mes partages</Text>
            <Text className="mt-1 text-sm text-muted-foreground">Les derniers ajoutés</Text>
          </View>
          <Icon name="Grid3x3" size={19} className="text-muted-foreground" />
        </View>

        {mine.length ? (
          <View className="flex-row flex-wrap gap-1.5">
            {mine.slice(0, 6).map((item) =>
              item.imageUrl ? (
                <Image
                  key={item.id}
                  source={{ uri: item.imageUrl }}
                  contentFit="cover"
                  style={styles.gridImage}
                />
              ) : (
                <View key={item.id} className="items-center justify-center bg-secondary" style={styles.gridImage}>
                  <Icon name="Sparkles" size={22} className="text-muted-foreground" />
                </View>
              ),
            )}
          </View>
        ) : (
          <View className="items-center rounded-3xl bg-muted px-6 py-8">
            <Text className="text-sm text-muted-foreground">Vos prochains partages apparaîtront ici.</Text>
          </View>
        )}

        {group ? (
          <>
            <Pressable
              onPress={() => void shareInvite()}
              className="mt-9 h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary active:opacity-85"
            >
              <Icon name="UserPlus" size={18} className="text-primary-foreground" />
              <Text className="font-semibold text-primary-foreground">Inviter une amie</Text>
            </Pressable>
            {shareMessage ? (
              <Text className="mt-3 text-center text-xs text-muted-foreground">{shareMessage}</Text>
            ) : null}
          </>
        ) : null}

        <Pressable
          onPress={() => void logout()}
          className="mt-4 h-14 flex-row items-center justify-center gap-2 rounded-full border border-border bg-card active:opacity-75"
        >
          <Icon name="LogOut" size={18} className="text-foreground" />
          <Text className="font-semibold text-foreground">Se déconnecter</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gridImage: { width: "32%", flexGrow: 1, aspectRatio: 1, borderRadius: 10 },
});
