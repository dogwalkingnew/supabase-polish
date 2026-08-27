# DogWalking — Correction de chargement Lovable/mobile 012

**Date :** 27 août 2026  
**Objet :** éliminer l’échec de chargement des routes internes après accès direct ou rechargement, sans modifier les parcours métier.

> **Correctif livré.** DogWalking utilise maintenant le **mode SPA officiel de TanStack Start** et produit un shell `_shell.html`. Le fichier de réécriture redirige les routes inconnues vers ce shell, ce qui permet à React Router de traiter `/walkers`, `/support`, `/ressources-legales`, les services et les espaces protégés, au lieu de laisser un hébergeur retourner une page d’erreur.

## Cause et correction

L’application utilise `BrowserRouter` et des écrans importés dynamiquement. Un accès direct à une route nécessite donc que l’hébergement serve d’abord le document de démarrage de l’application ; sinon, le serveur peut traiter la route comme une ressource inconnue ou tenter un rendu serveur qui échoue avant l’hydratation. Le mode SPA de TanStack Start génère spécifiquement ce shell et prévoit une réécriture de tous les `404` vers lui. [1]

La première tentative de CI de cette correction a confirmé un second problème lié au pré-rendu : le shell recevait une réponse `500` pour `/` lorsque les variables Supabase n’étaient pas présentes dans la CI. La correction empêche désormais `AuthProvider` d’initialiser Supabase **uniquement pendant le pré-rendu sans navigateur**. Dès que l’application s’exécute dans un navigateur, l’initialisation reste identique : l’absence de `VITE_SUPABASE_URL` ou de `VITE_SUPABASE_PUBLISHABLE_KEY` provoque toujours une erreur de configuration explicite, sans clé intégrée au code.

Un second facteur de risque mobile a été identifié dans l’artefact historique : un service worker avec des caches `dogwalking-v2` et `dogwalking-static-v2` utilisait une stratégie cache-first pour les assets. Bien qu’aucun nouvel enregistrement ne soit actif dans le code actuel, un téléphone ayant déjà visité une version antérieure peut garder ce contrôleur et demander des chunks devenus obsolètes. Au premier montage client, DogWalking désinscrit désormais les workers du même domaine et efface uniquement les caches dont le nom commence par `dogwalking-`.

La configuration `vite.config.ts` active `tanstackStart.spa.enabled`. La règle publiée est :

```text
/*    /_shell.html  200
```

Le changement reste volontairement limité au routage et au build. Aucun flux de réservation, droit Supabase, donnée, paiement ou contenu métier n’a été modifié dans cette correction.

## Vérifications effectuées

| Élément testé | Résultat |
|---|---|
| TypeScript et build de production | Réussis après activation du mode SPA. |
| Build sans variables Supabase de production | Réussi après la barrière de pré-rendu Auth ; le shell est généré sans utiliser de valeur de remplacement. |
| Artefact produit | `.output/public/_shell.html` et `.output/public/_redirects` générés. |
| Rechargement direct `/walkers` | Le contenu et les assets se chargent depuis le shell SPA dans un navigateur réel. |
| Rechargement direct `/support` | Le contenu et les assets se chargent depuis le shell SPA dans un navigateur réel. |
| Rechargement direct `/ressources-legales` | La page se charge depuis le shell SPA. |
| Rechargement direct `/services/garde` | La route à import dynamique se charge depuis le shell SPA. |
| Rechargement direct `/dashboard` en visiteur | Redirection vers `/auth?redirect=%2Fdashboard`, sans erreur de plateforme. |
| Nettoyage du cache historique | Exécuté dans un effet client après montage ; il ne touche ni Supabase, ni les caches d’un autre domaine. |

## Limite de vérification Lovable

L’URL lisible dans la capture, `kle-polish.lovable.app`, retourne actuellement **« Project not found »** lors du contrôle ; le sous-domaine exact qui affichait l’erreur ne peut donc pas être rechargé ici. Le correctif est néanmoins présent dans l’artefact que doit déployer Lovable. Après publication de ce commit dans le projet Lovable, les routes ci-dessus devront être testées directement sur le domaine final, à partir d’un nouvel onglet et après rechargement de page. Lors de cette première ouverture, le nettoyage de l’ancien cache est automatique.

La capture a aussi révélé que certaines pages historiques conservent des promesses non factuelles dans leurs contenus, par exemple la route `/services/garde`. Cette observation est distincte du défaut de chargement ; elle est documentée, mais aucune modification de contenu n’est incluse ici afin de ne pas introduire de régression dans une correction de compatibilité.

## Référence

[1] [TanStack Start — SPA mode](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode)
