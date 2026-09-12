export type RecommendationCategory = "book" | "movie" | "series" | "place";
export type DatabaseRecommendationCategory = "books" | "films" | "series" | "places";

export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  title: string;
  comment?: string;
  url?: string;
  imageUrl?: string;
  description?: string;
  sourceName?: string;
  sourceDomain?: string;
  author: string;
  userId: string;
  dateLabel: string;
  createdAt: string;
}

export const categoryMeta: Record<
  RecommendationCategory,
  {
    label: string;
    singular: string;
    icon: "BookOpen" | "Clapperboard" | "Tv" | "MapPin";
    databaseValue: DatabaseRecommendationCategory;
  }
> = {
  book: { label: "Livres", singular: "Livre", icon: "BookOpen", databaseValue: "books" },
  movie: { label: "Films", singular: "Film", icon: "Clapperboard", databaseValue: "films" },
  series: { label: "Séries", singular: "Série", icon: "Tv", databaseValue: "series" },
  place: { label: "Adresses", singular: "Adresse", icon: "MapPin", databaseValue: "places" },
};

export function toDatabaseCategory(category: RecommendationCategory): DatabaseRecommendationCategory {
  return categoryMeta[category].databaseValue;
}

export function fromDatabaseCategory(
  category: DatabaseRecommendationCategory,
): RecommendationCategory {
  switch (category) {
    case "books":
      return "book";
    case "films":
      return "movie";
    case "series":
      return "series";
    case "places":
      return "place";
  }
}
