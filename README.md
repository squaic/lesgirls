# Les Girls

Mobile-first private recommendation app for books, films, series and favorite places.

## Stack

Expo 55, React Native, Expo Router, NativeWind, Supabase and Vercel.

## Backend

The app reuses the existing Supabase schema: `profiles`, `groups`, `group_members` and `recommendations`. RLS remains the security boundary. The client uses only the public anon/publishable key; never expose a `service_role` key.

## Environment variables

Preferred Expo names:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-public-key
```

For compatibility with the existing Vercel project, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are also supported.

## Commands

```bash
npm install
npm run typecheck
npm run web
npm run build:web
```

The Vercel web build exports to `dist`. `api/metadata.ts` provides authenticated URL metadata extraction. The web app includes a PWA manifest, app icon and service worker so it can be added to an iPhone or Android home screen.
