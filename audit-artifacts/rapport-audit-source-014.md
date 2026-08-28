# DogWalking — Audit de sources et correction de publication 014

> **État : en cours de validation.** Ce document sépare les éléments vérifiés dans le dépôt, les corrections appliquées et les prérequis externes qui ne peuvent pas être résolus par un simple commit GitHub.

## Constat initial

Le diagnostic exécuté dans un navigateur sur `https://supabase-sparkle-polish.lovable.app/walkers` a relevé une exception du client Supabase : les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` n’étaient pas transmises au build Lovable. La branche distante `main` pointait déjà sur `c1b88b59a3808c1fff33b327d5ae64064e5fbfdf` avant cette vague ; un nouveau commit sera donc publié en avance rapide après les corrections, plutôt qu’un push forcé inutile.

Le projet Supabase relié au code est `aqitjhaotpautjywoeys` (`Front et backend dogwalking`), dans l’état `ACTIVE_HEALTHY`. Son URL API publique correspond à `https://aqitjhaotpautjywoeys.supabase.co`. Une clé de publication moderne active existe. La documentation Supabase indique qu’une clé `sb_publishable_*` est adaptée aux navigateurs et aux applications clientes, tandis qu’une clé secrète doit rester limitée aux serveurs ; la présente correction n’ajoute aucune clé serveur au code ni au bundle.[1]

## Corrections déjà appliquées

| Domaine | Correction | Statut |
|---|---|---|
| Publication Lovable | Repli vers l’URL Supabase publique et la clé `sb_publishable_*` active lorsque Lovable n’injecte pas `VITE_*`. | À valider après publication |
| PWA | Désactivation de l’enregistrement du service worker historique sur `*.lovable.app` pour empêcher un cache obsolète de survivre au déploiement. | À valider après publication |
| Espace Accompagnateur | Lien « Voir la mission » corrigé de `/booking/:id` vers la route déclarée `/bookings/:id`. | Vérifié au build |
| Administration | Remplacement du pseudo-funnel à pourcentages arbitraires par un état des réservations calculé uniquement depuis les statuts présents en base. | Vérifié au build |
| Services publics | Retrait des avis, études de cas, statistiques, garanties, disponibilités et soins présentés comme acquis dans les pages de garde, de visite et multi-animaux. | Vérifié au build |
| Référencement | Retrait des notes agrégées, numéros, e-mails, réseaux sociaux, position de marché, promesses de paiement et certification non vérifiés du SEO public. | Vérifié au build |
| Sources historiques | Retrait des fichiers non importés contenant des avis, zones et tableaux de démonstration. | Vérifié au build |
| Services génériques | Neutralisation de `/services/:slug` et retrait de son ancien catalogue, qui pouvait encore exposer des engagements de soin, de paiement, de disponibilité et de certification non établis. Les pages de service auditées restent accessibles. | Vérifié au navigateur |
| Métadonnées d’accueil | Remplacement de « promenades et gardes vérifiées » par une présentation factuelle des demandes de promenade et garde. | Vérifié au build |
| Routeur hybride | Séparation de l’historique du shell TanStack (mémoire) et du routeur React métier (navigateur), puis recette sans avertissement React ni exception sur les routes testées. | Vérifié au navigateur |

## Données et espaces réellement présents

Les quatre surfaces demandées sont présentes dans les routes actives : accueil et recherche publique, tableau Propriétaire (`/dashboard`), tableau Accompagnateur (`/walker/dashboard`) et administration (`/admin`). Les protections de rôle sont réalisées via `ProtectedRoute`, avec contrôle de rôle distinct pour l’administration. Le schéma Supabase comporte les tables de profils, rôles, animaux, profils Accompagnateur, réservations, candidatures, documents, notifications, messages, litiges, incidents et preuves ; la RLS est active sur chacune des tables auditées.

Les tables `reviews`, `messages`, `walker_documents`, `walk_proofs`, `disputes`, `incident_reports`, `favorites` et `walker_earnings` étaient vides au moment du contrôle. Il s’agit de données métier à produire par de vrais utilisateurs et administrateurs, non de données à simuler.

## Pré-requis externes restant à valider

L’advisor Supabase signale que la protection contre les mots de passe compromis est désactivée. Son activation est un réglage du tableau de bord Supabase. Les informations légales de l’éditeur, les politiques définitives, les conditions opérationnelles et tout canal de support réel doivent aussi être fournis et validés par le propriétaire du service avant publication.

Les alertes de performance concernent essentiellement des index non observés et la coexistence de politiques RLS permissives. Elles ne justifient pas une suppression non mesurée d’index ou de règles d’accès dans cette vague.

## Contrôles exécutés

Après les corrections, `pnpm run typecheck`, `pnpm run lint`, `pnpm run build` et `pnpm run audit:prod` ont tous réussi. L’audit des dépendances ne signale aucune vulnérabilité connue de niveau haut ou critique. La recette navigateur locale a confirmé que l’accueil, `/walkers`, les trois pages de service corrigées et la redirection anonyme de `/dashboard` se rendent après hydratation.

La même recette a confirmé qu’une ancienne URL secondaire, `/services/visite-sanitaire`, affiche désormais une page 404 DogWalking normale et sans erreur console, au lieu de rendre l’ancien contenu de service. Les appels à l’action secondaires sur les pages de service sont maintenant nommés par leur action exacte, et les cartes de service ne renvoient plus vers une page de prestation incohérente.

## Limites de validation assumées

| Élément | État vérifié | Validation qui reste nécessaire |
|---|---|---|
| Accueil, recherche, services et 404 | Rendu local après hydratation, sans exception relevée. | Contrôle après propagation GitHub sur le domaine Lovable exact. |
| Tableau Propriétaire | La route anonyme redirige vers l’authentification. Le code et les gardes de rôle sont présents. | Connexion de recette avec un vrai compte Propriétaire autorisé. |
| Tableau Accompagnateur | La route et les actions analysées sont présentes ; le lien de détail de mission est corrigé. | Connexion de recette avec un vrai compte Accompagnateur autorisé. |
| Administration | La route est protégée par le rôle Administrateur ; les indicateurs ne reposent plus sur un pseudo-funnel. | Connexion avec le compte Administrateur confirmé, après validation de son e-mail. |
| Lovable | Le build n’exige plus que Lovable injecte deux variables publiques Supabase manquantes. | Confirmation du déploiement automatique par Lovable, inaccessible sans session Lovable active dans le navigateur partagé. |

## Vérification du domaine Lovable après synchronisation

Le 28 août 2026, la branche `main` du dépôt GitHub a été avancée de `c1b88b59` à `a8a49c3f`, puis la CI GitHub `33128104938` a réussi. L’extraction fraîche du domaine `https://supabase-sparkle-polish.lovable.app/` et de `/walkers` sert toutefois encore l’ancien titre Open Graph « promenades et gardes de chiens vérifiées » ainsi que l’écran « Impossible d’afficher cette page ». Ces deux indices démontrent que Lovable n’a pas encore servi le commit `a8a49c3f` au moment du contrôle ; ce résultat ne permet pas de conclure que le correctif est en ligne.

Le projet Lovable associé est `lovp_1tcvy30dwd9trsgp0drtktkwy5`. Il faut y déclencher le redéploiement ou rétablir la synchronisation GitHub, puis vérifier que l’aperçu HTML porte le titre « DogWalking — Demandes de promenade et garde » et que l’accueil comme `/walkers` s’affichent sans écran de repli. Le navigateur connecté à Lovable a expiré pendant ce contrôle et doit être reconnecté pour effectuer cette action dans l’interface.

## Références

[1] [Supabase — Migrating to publishable and secret API keys](https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys)
