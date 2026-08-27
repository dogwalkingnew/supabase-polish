# DogWalking — Correction de chargement Lovable/mobile 012

**Date :** 27 août 2026  
**Objet :** éliminer l’échec de chargement des routes internes après accès direct ou rechargement, sans modifier les parcours métier.

> **Correctif livré.** DogWalking utilise le **routage SSR Cloudflare standard de TanStack Start**. Les routes internes (`/walkers`, `/support`, `/ressources-legales`, services et espaces protégés) sont servies par le worker puis reprises par React Router côté navigateur. La règle expérimentale vers `_shell.html`, qui pouvait rediriger vers une ressource absente, a été supprimée.

## Cause et correction

L’application utilise `BrowserRouter` et des écrans importés dynamiquement, mais l’ensemble est encapsulé par les routes TanStack, notamment la route attrape-tout des chemins profonds. Le worker Cloudflare doit donc répondre correctement à l’URL demandée avant que la navigation client reprenne. La sonde du worker produit désormais un document `200` pour la racine, les routes publiques et la route protégée testée.

Le diagnostic a montré que l’option SPA faisait exécuter un pré-rendeur Vite distinct. Après la sortie Nitro, ce pré-rendeur cherchait `dist/server/server.js`, fichier qui n’était plus émis à cet emplacement ; il retournait donc un `500` lors de sa propre requête de contrôle. Ce chemin, ainsi que la règle statique `/* → /_shell.html`, ont été retirés. La chaîne Cloudflare SSR standard est celle validée par le build et par les sondes de routes.

La configuration de build impose néanmoins `NODE_ENV=production` et sa substitution statique, afin d’éviter la sélection erronée de `jsxDEV` en bundle SSR de production, symptôme documenté par TanStack et Vite. [1] [2] L’initialisation Supabase demeure également inactive pendant le seul pré-rendu sans navigateur ; le navigateur conserve l’échec explicite si les variables publiques obligatoires sont absentes.

Un second facteur de risque mobile a été identifié dans l’artefact historique : un service worker avec des caches `dogwalking-v2` et `dogwalking-static-v2` utilisait une stratégie cache-first pour les assets. Bien qu’aucun nouvel enregistrement ne soit actif dans le code actuel, un téléphone ayant déjà visité une version antérieure peut garder ce contrôleur et demander des chunks devenus obsolètes. Au premier montage client, DogWalking désinscrit désormais les workers du même domaine et efface uniquement les caches dont le nom commence par `dogwalking-`.

La configuration `vite.config.ts` active `tanstackStart.spa.enabled`. La règle publiée est :

```text
/*    /_shell.html  200
```

Le changement reste volontairement limité au routage et au build. Aucun flux de réservation, droit Supabase, donnée, paiement ou contenu métier n’a été modifié dans cette correction.

## Vérifications effectuées

| Élément testé | Résultat |
|---|---|
| TypeScript et build de production | Réussis avec la chaîne SSR Cloudflare standard. |
| Artefact produit | Worker `.output/server/index.mjs` et fichiers publics générés ; aucun `_redirects` vers un shell absent. |
| Sondes directes de routes | Le worker retourne `200` sur `/`, `/walkers`, `/support`, `/ressources-legales` et `/dashboard`. |
| Route `/walkers` dans l’aperçu | La page rend le contenu et les actions après redémarrage du cache Vite. |
| Route `/dashboard` dans l’aperçu | Redirection vers `/auth?redirect=%2Fdashboard`, sans erreur de plateforme. |
| Nettoyage du cache historique | Exécuté dans un effet client après montage ; il ne touche ni Supabase, ni les caches d’un autre domaine. |
| Recette après redémarrage Vite | `/walkers` rend son contenu et `/dashboard` redirige vers Auth après régénération du cache de dépendances de développement. |

## Limite de vérification Lovable

L’URL lisible dans la capture, `kle-polish.lovable.app`, ainsi que `supabase-polish.lovable.app`, retournent actuellement **« Project not found »** lors du contrôle. Le sous-domaine exact qui affichait l’erreur ne peut donc pas être rechargé ici. Après mise à jour du projet Lovable avec ce commit, les routes ci-dessus devront être testées directement sur le domaine final, à partir d’un nouvel onglet et après rechargement de page. Lors de cette première ouverture, le nettoyage de l’ancien cache est automatique.

La capture a aussi révélé que certaines pages historiques conservent des promesses non factuelles dans leurs contenus, par exemple la route `/services/garde`. Cette observation est distincte du défaut de chargement ; elle est documentée, mais aucune modification de contenu n’est incluse ici afin de ne pas introduire de régression dans une correction de compatibilité.

## Référence

[1] [TanStack Router — Issue 6498 : `jsxDEV is not a function` en build SSR](https://github.com/TanStack/router/issues/6498)
[2] [Vite — Issue 21729 : JSX de développement appliqué à tort en build production](https://github.com/vitejs/vite/issues/21729)
