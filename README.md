# CCT DERIV TERMINAL — prototype 0.1

**Prototype fonctionnel** de terminal de consultation des marchés Deriv, basé sur React, TypeScript, Vite et TradingView Lightweight Charts 5.0.

## Inclus
- Graphiques en chandeliers avec prix Deriv publics en direct (WebSocket) et jusqu'à 500 bougies historiques par requête.
- Recherche dynamique d'instruments via `active_symbols`, favoris, timeframes, EMA 20 et SMA 50.
- Reconnexion WebSocket, statut réseau, affichage d'erreurs, interface sombre responsive.
- Consultation publique sans compte. Authentification facultative Supabase par lien e-mail et sauvegarde cloud des favoris, avec RLS.

## Non inclus (phases suivantes)
- Outils de dessin, Fibonacci, RSI/MACD et autres indicateurs, replay/backtesting, ordres réels, CFD/MT5, journal de trades, graphiques multi-fenêtres.
- Les timeframes peuvent varier selon les marchés et les limitations de l'API Deriv. Aucune donnée synthétique n'est substituée aux données réelles.

## Démarrage
1. Installer Node.js 20.19+ (ou version compatible avec Vite 6).
2. `npm install`
3. Copier `.env.example` vers `.env`.
4. **Enregistrer votre propre app ID** dans le portail développeur Deriv et remplacer `VITE_DERIV_APP_ID=1089` pour un usage de groupe. L'ID 1089 est un exemple de démonstration et peut être limité.
5. `npm run dev` puis ouvrir l'URL affichée.
6. `npm run build` pour produire `dist/`.

## Comptes et sauvegardes (optionnel)
1. Créer un projet Supabase gratuit.
2. Exécuter `supabase.sql` dans le SQL Editor (sur un projet neuf).
3. Activer le fournisseur d'authentification Email et configurer les URL de redirection (adresse du site Cloudflare Pages et URL de développement).
4. Renseigner `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans `.env` et dans les variables de build Cloudflare Pages.
5. Ne jamais placer une `service_role` key Supabase ni un secret Deriv dans `VITE_*`.
6. Les favoris des visiteurs non connectés restent dans leur navigateur; les favoris des membres connectés sont synchronisés avec Supabase.

## Déployer gratuitement sur Cloudflare Pages
1. Décompresser le ZIP et importer les fichiers dans un dépôt GitHub.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Choisir le dépôt.
4. Framework preset: `Vite`; build command: `npm run build`; output directory: `dist`.
5. Ajouter les variables d'environnement VITE_DERIV_APP_ID et, si souhaité, les deux variables Supabase.
6. Déployer, puis ajouter l'URL Pages dans les redirections Supabase.

**Note** : les connexions WebSocket se font directement depuis le navigateur du membre. Les quotas et conditions Deriv restent applicables. Le plan gratuit Cloudflare/Supabase peut changer. La connexion API peut être soumise à des exigences de domaine, d'app ID ou d'autorisation. Aucun trading réel n'est possible dans ce prototype.

## Sécurité et limites
Mise à jour du terminal — API publique Deriv
- Pas de collecte d'identifiants Deriv.
- Pas d'ordres réels ni de simulations présentées comme exécutées.
- Supabase RLS isole les favoris par membre.
- Le code doit être testé avec votre app ID et les instruments souhaités avant toute diffusion au groupe.
