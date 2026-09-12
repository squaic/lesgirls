import { Image } from "expo-image";
import { router } from "expo-router";
import * as React from "react";
import { FlatList, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Brand } from "@/components/les-girls/brand";
import {
  categoryMeta,
  Recommendation,
  RecommendationCategory,
} from "@/data/recommendations";
import Icon from "@/lib/icons/LucideIcon";
import { useLesGirls } from "@/lib/les-girls";
import { cn } from "@/lib/utils";

type FeedFilter = RecommendationCategory | "all";
type FeedCategory = RecommendationCategory | "movies-and-series";
const filters: { value: FeedFilter; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "book", label: "Livre" },
  { value: "movie", label: "Film" },
  { value: "series", label: "Série" },
  { value: "place", label: "Adresse" },
];

function RecommendationCard({ item }: { item: Recommendation }) {
  const meta = categoryMeta[item.category];

  const openSource = () => {
    if (item.url) void Linking.openURL(item.url);
  };

  return (
    <View className="mb-9 overflow-hidden rounded-[28px] bg-card">
      <View className="flex-row items-center justify-between px-4 py-3.5">
        <View className="flex-row items-center gap-3">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <Text className="font-semibold text-secondary-foreground">
              {item.author.slice(0, 1).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text className="text-sm font-semibold text-card-foreground">{item.author}</Text>
            <Text className="text-xs text-muted-foreground">{item.dateLabel}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1.5 rounded-full bg-muted px-2.5 py-1.5">
          <Icon name={meta.icon} size={13} className="text-muted-foreground" />
          <Text className="text-[11px] font-medium text-muted-foreground">{meta.singular}</Text>
        </View>
      </View>

      <Pressable disabled={!item.url} onPress={openSource}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} contentFit="cover" transition={250} style={styles.feedImage} />
        ) : (
          <View className="w-full items-center justify-center bg-secondary" style={styles.feedImage}>
            <Icon name={meta.icon} size={44} className="text-muted-foreground" />
          </View>
        )}
      </Pressable>

      <View className="px-4 pb-5 pt-4">
        <View className="flex-row items-start justify-between gap-4">
          <Pressable disabled={!item.url} onPress={openSource} className="flex-1">
            <Text className="text-h3 leading-7 text-card-foreground">{item.title}</Text>
          </Pressable>
          {item.url ? (
            <Pressable
              accessibilityLabel="Ouvrir le lien"
              onPress={openSource}
              className="h-10 w-10 items-center justify-center rounded-full bg-muted active:opacity-70"
            >
              <Icon name="ArrowUpRight" size={19} className="text-muted-foreground" />
            </Pressable>
          ) : null}
        </View>
        {item.comment ? (
          <Text className="mt-2 text-[14px] leading-5 text-muted-foreground">{item.comment}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ feedImage: { width: "100%", aspectRatio: 0.82 } });

function FilterRow({
  selected,
  onSelect,
}: {
  selected: FeedFilter;
  onSelect: (value: FeedFilter) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-5 py-1"
    >
      {filters.map((filter) => (
        <Pressable
          key={filter.value}
          onPress={() => onSelect(filter.value)}
          className={cn(
            "rounded-full border px-4 py-2.5",
            selected === filter.value ? "border-primary bg-primary" : "border-border bg-background",
          )}
        >
          <Text
            className={cn(
              "text-sm",
              selected === filter.value
                ? "font-semibold text-primary-foreground"
                : "text-muted-foreground",
            )}
          >
            {filter.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const categoryCopy: Record<FeedCategory, { title: string; subtitle: string }> = {
  book: { title: "La bibliothèque", subtitle: "Les livres que l’on se passe de main en main." },
  movie: { title: "À voir ce soir", subtitle: "Des films qui méritent vraiment deux heures." },
  series: { title: "À suivre", subtitle: "Les séries qui nous ont fait veiller trop tard." },
  "movies-and-series": {
    title: "Films et séries",
    subtitle: "Les histoires à voir et à suivre, choisies par vos amies.",
  },
  place: {
    title: "Nos adresses",
    subtitle: "Les tables et lieux que l’on veut garder près de soi.",
  },
};

export function FeedScreen({ category }: { category?: FeedCategory }) {
  const { firstName, recommendations, refreshing, refresh } = useLesGirls();
  const [filter, setFilter] = React.useState<FeedFilter>(
    category === "movies-and-series" ? "all" : (category ?? "all"),
  );
  const active = category ?? filter;
  const data =
    active === "all"
      ? recommendations
      : active === "movies-and-series"
        ? recommendations.filter((item) => item.category === "movie" || item.category === "series")
        : recommendations.filter((item) => item.category === active);
  const copy = category
    ? categoryCopy[category]
    : { title: "Derniers coups de cœur", subtitle: "Ce que vos amies ont aimé cette semaine." };

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-background">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecommendationCard item={item} />}
        refreshing={refreshing}
        onRefresh={() => void refresh()}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="mx-auto w-full max-w-lg px-4 pb-32"
        ListHeaderComponent={
          <View className="pb-5">
            <View className="flex-row items-center justify-between px-1 pb-8 pt-2">
              <Brand compact />
              <Pressable
                onPress={() => router.push("/(tabs)/profile")}
                accessibilityLabel="Ouvrir le profil"
                className="h-10 w-10 items-center justify-center rounded-full bg-primary"
              >
                <Text className="font-semibold text-primary-foreground">
                  {firstName.slice(0, 1).toUpperCase()}
                </Text>
              </Pressable>
            </View>
            <Text className="mt-5 text-h1 leading-[41px] text-foreground">{copy.title}</Text>
            <Text className="mt-2 text-[15px] leading-6 text-muted-foreground">
              {copy.subtitle}
            </Text>
            {!category && (
              <View className="-mx-5 mt-5">
                <FilterRow selected={filter} onSelect={setFilter} />
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View className="items-center rounded-3xl bg-muted px-8 py-12">
            <Icon name="Sparkles" size={28} className="text-muted-foreground" />
            <Text className="mt-4 text-h3 text-foreground">À vous de jouer</Text>
            <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground">
              Partagez le premier coup de cœur de cette catégorie.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
