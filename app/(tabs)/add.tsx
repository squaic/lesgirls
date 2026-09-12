import { router } from "expo-router";
import * as React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Brand } from "@/components/les-girls/brand";
import { categoryMeta, RecommendationCategory } from "@/data/recommendations";
import Icon from "@/lib/icons/LucideIcon";
import { useLesGirls } from "@/lib/les-girls";
import { cn } from "@/lib/utils";

const categories = Object.entries(categoryMeta) as [
  RecommendationCategory,
  (typeof categoryMeta)[RecommendationCategory],
][];

type Metadata = {
  url?: string;
  title?: string;
  imageUrl?: string;
  description?: string;
  sourceName?: string;
  sourceDomain?: string;
};

export default function AddRecommendationScreen() {
  const { addRecommendation, session } = useLesGirls();
  const [url, setUrl] = React.useState("");
  const [category, setCategory] = React.useState<RecommendationCategory>("book");
  const [title, setTitle] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [metadata, setMetadata] = React.useState<Metadata>({});
  const [busy, setBusy] = React.useState(false);
  const [analyzing, setAnalyzing] = React.useState(false);
  const [error, setError] = React.useState("");

  const analyzeUrl = React.useCallback(async (): Promise<Metadata> => {
    const cleanUrl = url.trim();
    if (!cleanUrl) {
      setMetadata({});
      return {};
    }

    setAnalyzing(true);
    try {
      const response = await fetch("/api/metadata", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(session?.access_token ? { authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ url: cleanUrl }),
      });
      const data = (await response.json()) as Metadata & { error?: string };
      if (!response.ok) throw new Error(data.error || "Extraction impossible");
      setMetadata(data);
      setTitle((current) => current.trim() || data.title?.trim() || "");
      return data;
    } catch {
      let sourceDomain = "";
      try {
        sourceDomain = new URL(cleanUrl).hostname.replace(/^www\./, "");
      } catch {
        // The form can still be completed manually.
      }
      const fallback = { url: cleanUrl, sourceDomain };
      setMetadata(fallback);
      return fallback;
    } finally {
      setAnalyzing(false);
    }
  }, [session?.access_token, url]);

  const submit = async () => {
    if (!title.trim()) {
      setError("Ajoutez un titre pour partager ce coup de cœur.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const resolvedMetadata = url.trim() && !metadata.url ? await analyzeUrl() : metadata;
      await addRecommendation({
        category,
        title: title.trim(),
        comment: comment.trim() || undefined,
        url: resolvedMetadata.url || url.trim() || undefined,
        imageUrl: resolvedMetadata.imageUrl,
        description: resolvedMetadata.description,
        sourceName: resolvedMetadata.sourceName,
        sourceDomain: resolvedMetadata.sourceDomain,
      });
      setUrl("");
      setTitle("");
      setComment("");
      setMetadata({});
      router.replace("/(tabs)");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible de publier ce partage.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="mx-auto w-full max-w-lg px-5 pb-32"
        >
          <View className="flex-row items-center justify-between pb-8 pt-2">
            <Brand compact />
          </View>
          <Text className="text-h1 leading-[41px] text-foreground">Nouveau partage</Text>
          <Text className="mt-2 text-[15px] leading-6 text-muted-foreground">
            Une bonne découverte mérite de circuler.
          </Text>

          <View className="mt-8 gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-foreground">Lien</Text>
              {analyzing ? <Text className="text-xs text-muted-foreground">Récupération…</Text> : null}
            </View>
            <TextInput
              value={url}
              onChangeText={(value) => {
                setUrl(value);
                if (metadata.url && value.trim() !== metadata.url) setMetadata({});
              }}
              onEndEditing={() => void analyzeUrl()}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              placeholder="Collez une URL (optionnel)"
              placeholderTextColor="#8A7D79"
              className="h-14 rounded-2xl border border-border bg-card px-4 text-foreground"
            />
          </View>

          <Text className="mb-3 mt-7 text-sm font-semibold text-foreground">Catégorie</Text>
          <View className="flex-row flex-wrap gap-3">
            {categories.map(([value, meta]) => {
              const selected = value === category;
              return (
                <Pressable
                  key={value}
                  onPress={() => setCategory(value)}
                  className={cn(
                    "h-28 w-[48%] flex-grow justify-between rounded-3xl border p-4",
                    selected ? "border-primary bg-primary" : "border-border bg-card",
                  )}
                >
                  <Icon
                    name={meta.icon}
                    size={23}
                    className={selected ? "text-primary-foreground" : "text-foreground"}
                  />
                  <Text
                    className={cn(
                      "text-base font-semibold",
                      selected ? "text-primary-foreground" : "text-foreground",
                    )}
                  >
                    {meta.singular}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-7 gap-2">
            <Text className="text-sm font-semibold text-foreground">Titre</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              maxLength={300}
              placeholder="Ce que vous recommandez"
              placeholderTextColor="#8A7D79"
              className="h-14 rounded-2xl border border-border bg-card px-4 text-foreground"
            />
          </View>

          <View className="mt-5 gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm font-semibold text-foreground">Votre mot</Text>
              <Text className="text-xs text-muted-foreground">Optionnel</Text>
            </View>
            <TextInput
              value={comment}
              onChangeText={setComment}
              multiline
              maxLength={240}
              textAlignVertical="top"
              placeholder="Pourquoi vos amies vont aimer…"
              placeholderTextColor="#8A7D79"
              className="min-h-28 rounded-2xl border border-border bg-card px-4 py-4 text-foreground"
            />
            <Text className="text-right text-xs text-muted-foreground">{comment.length}/240</Text>
          </View>

          {error ? <Text className="mt-3 text-sm leading-5 text-destructive">{error}</Text> : null}

          <Pressable
            disabled={busy || analyzing}
            onPress={() => void submit()}
            className="mt-6 h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary active:opacity-85 disabled:opacity-50"
          >
            <Text className="text-button text-primary-foreground">
              {busy ? "Partage…" : "Partager"}
            </Text>
            {!busy ? <Icon name="ArrowUpRight" size={18} className="text-primary-foreground" /> : null}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
