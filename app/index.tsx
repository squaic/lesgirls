import { Redirect, router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Brand } from "@/components/les-girls/brand";
import { useLesGirls } from "@/lib/les-girls";

function readableAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/invalid login credentials/i.test(message)) return "E-mail ou mot de passe incorrect.";
  if (/email not confirmed/i.test(message)) return "Confirmez d’abord votre adresse e-mail.";
  if (/user already registered/i.test(message)) return "Un compte existe déjà avec cette adresse e-mail.";
  if (/password/i.test(message) && /6/i.test(message)) return "Le mot de passe doit contenir au moins 6 caractères.";
  return message || "Impossible de continuer pour le moment.";
}

export default function LoginScreen() {
  const { invite } = useLocalSearchParams<{ invite?: string }>();
  const { configured, loading, isAuthenticated, group, signIn, signUp } = useLesGirls();
  const [isSignup, setIsSignup] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  if (!loading && isAuthenticated) {
    if (invite) return <Redirect href={`/join/${encodeURIComponent(invite)}`} />;
    return <Redirect href={group ? "/(tabs)" : "/group"} />;
  }

  const submit = async () => {
    if (!configured) {
      setError("La connexion Supabase doit encore être configurée sur ce déploiement.");
      return;
    }
    if (!email.includes("@") || password.length < 6 || (isSignup && !firstName.trim())) {
      setError("Vérifiez vos informations avant de continuer.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (isSignup) {
        const result = await signUp(firstName, email, password);
        if (result.needsEmailConfirmation) {
          setMessage("Compte créé. Vérifiez votre e-mail pour confirmer votre inscription.");
          return;
        }
      } else {
        await signIn(email, password);
      }

      if (invite) router.replace(`/join/${encodeURIComponent(invite)}`);
      else router.replace("/group");
    } catch (cause) {
      setError(readableAuthError(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 justify-between px-7 pb-6 pt-10">
        <View className="items-center gap-3">
          <View className="mt-8"><Brand /></View>
          <Text className="mt-2 max-w-xs text-center text-sm leading-5 text-muted-foreground">Vos découvertes préférées, gardées entre amies.</Text>
        </View>

        <View className="mx-auto w-full max-w-sm gap-4">
          {isSignup && (
            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">Prénom</Text>
              <TextInput value={firstName} onChangeText={setFirstName} autoComplete="given-name" placeholder="Votre prénom" placeholderTextColor="#8A7D79" className="h-14 rounded-2xl border border-border bg-card px-4 text-base text-foreground" />
            </View>
          )}
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">E-mail</Text>
            <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" placeholder="vous@exemple.com" placeholderTextColor="#8A7D79" className="h-14 rounded-2xl border border-border bg-card px-4 text-base text-foreground" />
          </View>
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Mot de passe</Text>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry autoComplete={isSignup ? "new-password" : "current-password"} placeholder="6 caractères minimum" placeholderTextColor="#8A7D79" className="h-14 rounded-2xl border border-border bg-card px-4 text-base text-foreground" />
          </View>

          {error ? <Text className="text-sm leading-5 text-destructive">{error}</Text> : null}
          {message ? <Text className="text-sm leading-5 text-success">{message}</Text> : null}

          <Pressable disabled={busy || loading} onPress={submit} className="mt-2 h-14 items-center justify-center rounded-full bg-primary active:opacity-85 disabled:opacity-50">
            <Text className="text-button text-primary-foreground">{busy ? "Un instant…" : isSignup ? "Créer mon espace" : "Se connecter"}</Text>
          </Pressable>

          <Pressable disabled={busy} onPress={() => { setIsSignup((value) => !value); setError(""); setMessage(""); }} className="py-2">
            <Text className="text-center text-sm text-muted-foreground">
              {isSignup ? "Déjà membre ? " : "Première visite ? "}
              <Text className="font-semibold text-foreground">{isSignup ? "Se connecter" : "Créer un compte"}</Text>
            </Text>
          </Pressable>
        </View>

        <Text className="text-center text-xs leading-5 text-muted-foreground">Un espace privé, sur invitation uniquement.</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
