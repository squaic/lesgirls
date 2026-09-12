import type { IconName } from "@/lib/icons/LucideIcon";

export interface TabItem {
  name: string;
  title: string;
  icon: IconName;
  primary?: boolean;
}

export const tabItems: TabItem[] = [
  { name: "index", title: "Accueil", icon: "House" },
  { name: "books", title: "Livres", icon: "BookOpen" },
  { name: "add", title: "Nouveau partage", icon: "Plus", primary: true },
  { name: "movies", title: "Films et séries", icon: "Clapperboard" },
  { name: "places", title: "Adresses", icon: "MapPin" },
];

export interface SettingsItem {
  id: string;
  label: string;
  icon: IconName;
  href?: "/notifications" | "/help-center";
}

export const settingsItems: SettingsItem[] = [
  { id: "notifications", label: "Notifications", icon: "Bell", href: "/notifications" },
  { id: "help", label: "Aide", icon: "Headphones", href: "/help-center" },
  { id: "privacy", label: "Confidentialité", icon: "ShieldCheck" },
  { id: "language", label: "Langue", icon: "Globe" },
];
