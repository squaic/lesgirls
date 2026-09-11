export const CATEGORIES = ["films", "series", "books", "places"] as const;
export type Category = (typeof CATEGORIES)[number];
export const CATEGORY_LABELS: Record<Category, string> = {
  films: "Films", series: "Séries", books: "Livres", places: "Bonnes adresses",
};
export const CATEGORY_ICONS: Record<Category, string> = {
  films: "✦", series: "▣", books: "▤", places: "⌖",
};
export function isCategory(value: unknown): value is Category { return CATEGORIES.includes(value as Category); }
