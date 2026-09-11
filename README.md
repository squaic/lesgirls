# Les Girlz

MVP mobile-first pour conserver les bons plans partagés dans un groupe privé. Construit avec Next.js, TypeScript, Tailwind CSS et Supabase.

## Installation

1. Créer un projet Supabase puis exécuter `supabase/migrations/001_initial_schema.sql` dans l’éditeur SQL.
2. Copier `.env.example` vers `.env.local` et renseigner l’URL et la clé publique Supabase. Ajouter facultativement `NEXT_PUBLIC_SITE_URL` pour afficher un lien d’invitation absolu.
3. Dans Supabase Auth, activer Email/Password et configurer l’URL du site.
4. Lancer `npm install`, puis `npm run dev`.

## Sécurité

Toutes les lectures et écritures métier sont protégées par Row Level Security. Les recommandations ne sont visibles qu’aux membres du groupe et seuls leurs auteurs peuvent les modifier ou les supprimer. L’extracteur de métadonnées valide les protocoles et les résolutions DNS à chaque redirection, refuse les réseaux privés, limite le temps et la taille de réponse, et traite uniquement le HTML comme du texte.
