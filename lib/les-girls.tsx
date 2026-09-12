import type { Session, User } from "@supabase/supabase-js";
import * as React from "react";

import {
  fromDatabaseCategory,
  Recommendation,
  RecommendationCategory,
  toDatabaseCategory,
  type DatabaseRecommendationCategory,
} from "@/data/recommendations";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface NewRecommendation {
  category: RecommendationCategory;
  title: string;
  comment?: string;
  url?: string;
  imageUrl?: string;
  description?: string;
  sourceName?: string;
  sourceDomain?: string;
}

interface Profile {
  id: string;
  first_name: string;
  created_at: string;
}

interface Group {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
}

interface LesGirlsContextValue {
  configured: boolean;
  loading: boolean;
  refreshing: boolean;
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  firstName: string;
  profile: Profile | null;
  group: Group | null;
  joinedAt: string | null;
  memberCount: number;
  recommendations: Recommendation[];
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    firstName: string,
    email: string,
    password: string,
  ) => Promise<{ needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  createGroup: (name: string) => Promise<void>;
  joinGroup: (inviteCodeOrUrl: string) => Promise<void>;
  addRecommendation: (recommendation: NewRecommendation) => Promise<void>;
  refresh: () => Promise<void>;
}

const LesGirlsContext = React.createContext<LesGirlsContextValue | null>(null);

function normalizeEmbeddedGroup(value: unknown): Group | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || typeof candidate !== "object") return null;
  const row = candidate as Partial<Group>;
  if (!row.id || !row.name || !row.invite_code || !row.created_at) return null;
  return row as Group;
}

function formatDateLabel(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diffDays = Math.round((startToday - startDate) / 86_400_000);

  if (diffDays <= 0) return "Aujourd’hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(date);
}

function createInviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = new Uint8Array(28);
  const cryptoObject = globalThis.crypto;
  if (cryptoObject?.getRandomValues) cryptoObject.getRandomValues(bytes);
  else for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  return Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("");
}

function extractInviteCode(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    const parts = parsed.pathname.split("/").filter(Boolean);
    return decodeURIComponent(parts.at(-1) || "");
  } catch {
    const parts = trimmed.split("/").filter(Boolean);
    return decodeURIComponent(parts.at(-1) || trimmed);
  }
}

export function LesGirlsProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [group, setGroup] = React.useState<Group | null>(null);
  const [joinedAt, setJoinedAt] = React.useState<string | null>(null);
  const [memberCount, setMemberCount] = React.useState(0);
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([]);

  const clearWorkspace = React.useCallback(() => {
    setProfile(null);
    setGroup(null);
    setJoinedAt(null);
    setMemberCount(0);
    setRecommendations([]);
  }, []);

  const loadWorkspace = React.useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) return;

    const [{ data: profileData, error: profileError }, { data: memberships, error: membershipError }] =
      await Promise.all([
        supabase.from("profiles").select("id, first_name, created_at").eq("id", userId).maybeSingle(),
        supabase
          .from("group_members")
          .select("group_id, joined_at, groups(id,name,invite_code,created_at)")
          .eq("user_id", userId)
          .order("joined_at", { ascending: true })
          .limit(1),
      ]);

    if (profileError) throw profileError;
    if (membershipError) throw membershipError;

    setProfile((profileData as Profile | null) ?? null);

    const membership = memberships?.[0] as
      | { group_id: string; joined_at: string; groups: unknown }
      | undefined;
    const activeGroup = normalizeEmbeddedGroup(membership?.groups);

    if (!membership || !activeGroup) {
      setGroup(null);
      setJoinedAt(null);
      setMemberCount(0);
      setRecommendations([]);
      return;
    }

    setGroup(activeGroup);
    setJoinedAt(membership.joined_at);

    const [{ data: rows, error: recommendationsError }, { count, error: countError }] =
      await Promise.all([
        supabase
          .from("recommendations")
          .select(
            "id,user_id,url,title,image_url,description,source_name,source_domain,category,comment,created_at",
          )
          .eq("group_id", activeGroup.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("group_members")
          .select("user_id", { count: "exact", head: true })
          .eq("group_id", activeGroup.id),
      ]);

    if (recommendationsError) throw recommendationsError;
    if (countError) throw countError;

    setMemberCount(count ?? 0);

    const userIds = [...new Set((rows ?? []).map((row) => row.user_id as string))];
    const { data: profiles, error: profilesError } = userIds.length
      ? await supabase.from("profiles").select("id, first_name").in("id", userIds)
      : { data: [], error: null };

    if (profilesError) throw profilesError;
    const firstNames = new Map((profiles ?? []).map((item) => [item.id as string, item.first_name as string]));

    const mapped = (rows ?? []).map((row) => {
      const createdAt = row.created_at as string;
      return {
        id: row.id as string,
        category: fromDatabaseCategory(row.category as DatabaseRecommendationCategory),
        title: row.title as string,
        comment: (row.comment as string | null) || undefined,
        url: (row.url as string | null) || undefined,
        imageUrl: (row.image_url as string | null) || undefined,
        description: (row.description as string | null) || undefined,
        sourceName: (row.source_name as string | null) || undefined,
        sourceDomain: (row.source_domain as string | null) || undefined,
        author: firstNames.get(row.user_id as string) || "Une Girl",
        userId: row.user_id as string,
        dateLabel: formatDateLabel(createdAt),
        createdAt,
      } satisfies Recommendation;
    });

    setRecommendations(mapped);
  }, []);

  const refresh = React.useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      await loadWorkspace(user.id);
    } finally {
      setRefreshing(false);
    }
  }, [loadWorkspace, user]);

  React.useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured) {
      setLoading(false);
      return () => undefined;
    }

    const initialize = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!mounted) return;
        setSession(data.session);
        setUser(data.session?.user ?? null);
        if (data.session?.user) await loadWorkspace(data.session.user.id);
        else clearWorkspace();
      } catch (error) {
        console.error("Unable to initialize Les Girls", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void initialize();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (!nextSession?.user) clearWorkspace();
      else void loadWorkspace(nextSession.user.id).catch((error) => console.error("Auth refresh failed", error));
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [clearWorkspace, loadWorkspace]);

  const signIn = React.useCallback(
    async (email: string, password: string) => {
      if (!isSupabaseConfigured) throw new Error("Supabase n’est pas encore configuré.");
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      setSession(data.session);
      setUser(data.user);
      await loadWorkspace(data.user.id);
    },
    [loadWorkspace],
  );

  const signUp = React.useCallback(
    async (firstName: string, email: string, password: string) => {
      if (!isSupabaseConfigured) throw new Error("Supabase n’est pas encore configuré.");
      const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/` : undefined;
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { first_name: firstName.trim() },
          emailRedirectTo: redirectTo,
        },
      });
      if (error) throw error;
      setSession(data.session);
      setUser(data.user);
      if (data.user && data.session) await loadWorkspace(data.user.id);
      return { needsEmailConfirmation: !data.session };
    },
    [loadWorkspace],
  );

  const signOut = React.useCallback(async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    setSession(null);
    setUser(null);
    clearWorkspace();
  }, [clearWorkspace]);

  const createGroup = React.useCallback(
    async (name: string) => {
      if (!user) throw new Error("Connectez-vous d’abord.");
      const cleanName = name.trim().slice(0, 80);
      if (!cleanName) throw new Error("Ajoutez un nom de groupe.");

      const { data, error } = await supabase
        .from("groups")
        .insert({ name: cleanName, created_by: user.id, invite_code: createInviteCode() })
        .select("id")
        .single();
      if (error) throw error;

      const { error: membershipError } = await supabase.from("group_members").insert({
        group_id: data.id,
        user_id: user.id,
        role: "owner",
      });
      if (membershipError) throw membershipError;
      await loadWorkspace(user.id);
    },
    [loadWorkspace, user],
  );

  const joinGroup = React.useCallback(
    async (inviteCodeOrUrl: string) => {
      if (!user) throw new Error("Connectez-vous d’abord.");
      const code = extractInviteCode(inviteCodeOrUrl);
      if (!code) throw new Error("Lien d’invitation invalide.");
      const { error } = await supabase.rpc("join_group_by_invite", { code });
      if (error) throw error;
      await loadWorkspace(user.id);
    },
    [loadWorkspace, user],
  );

  const addRecommendation = React.useCallback(
    async (recommendation: NewRecommendation) => {
      if (!user || !group) throw new Error("Aucun groupe actif.");
      const title = recommendation.title.trim().slice(0, 300);
      if (!title) throw new Error("Ajoutez un titre.");

      const { error } = await supabase.from("recommendations").insert({
        group_id: group.id,
        user_id: user.id,
        url: recommendation.url?.trim() || "",
        title,
        image_url: recommendation.imageUrl?.trim() || null,
        description: recommendation.description?.trim().slice(0, 1000) || null,
        source_name: recommendation.sourceName?.trim().slice(0, 120) || null,
        source_domain: recommendation.sourceDomain?.trim().slice(0, 255) || null,
        category: toDatabaseCategory(recommendation.category),
        comment: recommendation.comment?.trim().slice(0, 500) || null,
      });
      if (error) throw error;
      await loadWorkspace(user.id);
    },
    [group, loadWorkspace, user],
  );

  const firstName =
    profile?.first_name ||
    (typeof user?.user_metadata?.first_name === "string" ? user.user_metadata.first_name : "") ||
    "Une Girl";

  const value = React.useMemo<LesGirlsContextValue>(
    () => ({
      configured: isSupabaseConfigured,
      loading,
      refreshing,
      isAuthenticated: Boolean(user),
      user,
      session,
      firstName,
      profile,
      group,
      joinedAt,
      memberCount,
      recommendations,
      signIn,
      signUp,
      signOut,
      createGroup,
      joinGroup,
      addRecommendation,
      refresh,
    }),
    [
      addRecommendation,
      createGroup,
      firstName,
      group,
      joinGroup,
      joinedAt,
      loading,
      memberCount,
      profile,
      recommendations,
      refresh,
      refreshing,
      session,
      signIn,
      signOut,
      signUp,
      user,
    ],
  );

  return <LesGirlsContext.Provider value={value}>{children}</LesGirlsContext.Provider>;
}

export function useLesGirls() {
  const context = React.useContext(LesGirlsContext);
  if (!context) throw new Error("useLesGirls must be used within LesGirlsProvider");
  return context;
}
