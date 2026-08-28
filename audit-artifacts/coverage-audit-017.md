# Audit de couverture — DogWalking — 28 août 2026

## Routes déclarées

La table active de `src/App.tsx` couvre l’accueil, l’authentification et son callback, six pages de service, cinq anciens alias de service, les redirections de tableaux Propriétaire et Accompagnateur, les tableaux `/dashboard`, `/walker/dashboard` et `/admin`, les profils, réservations, messagerie, blog, support, ressources légales, annonces libres et les routes 404.

## Actions GO et Suivre

Le composant actif `src/components/dashboard/walker/MissionStartButton.tsx` ouvre un dialogue de prise en charge, exige une preuve photo, tente une position facultative, téléverse dans le bucket privé `walk-proofs`, puis appelle la RPC `record_walk_proof_and_transition`. Le libellé a été rendu explicite : `GO · Démarrer la mission`. Cette action n’est rendue qu’à l’Accompagnateur concerné quand la réservation est `confirmed`.

Le composant actif `src/components/dashboard-v3/OwnerHomeImproved.tsx` affiche la prochaine demande réelle issue de `useOwnerDashboard`. Son bouton ouvre `/bookings/:id`; le libellé a été rendu explicite : `Suivre la demande`, avec un aria-label associé au nom de l’Accompagnateur. Aucune mission fictive n’est créée par ce bouton.

## Composants à ne pas confondre avec les parcours actifs

`WalkerHome.tsx` est une ancienne maquette non importée par la route active et contient des props d’évaluations et de montants qui ne doivent pas être considérées comme une fonctionnalité actuelle. `TrustBadges.tsx` contient des valeurs par défaut historiques promettant paiement sécurisé, certifications, protection et statistiques ; il n’est pas importé par les parcours actifs recensés, mais doit rester dans la liste des sources historiques à supprimer ou assainir avant de déclarer l’ensemble du dépôt exempt de contenu non factuel. `ReferralTab.tsx` et les modules de formation historiques doivent également être vérifiés comme sources non atteignables.

## Recette navigateur

La sonde CDP exhaustive a testé 57 URL publiques, alias, redirections, pages de service, routes protégées en accès anonyme et routes inconnues. Aucun événement `Runtime.exceptionThrown`, erreur console ni spinner persistant n’a été relevé après attente d’hydratation. Les routes protégées redirigent vers `/auth` avec un paramètre de destination. Les routes inconnues de service et globales rendent l’état 404 DogWalking.

## Limites de la recette

Les mutations GO et les interactions de suivi nécessitent un compte Accompagnateur ou Propriétaire connecté et des données de réservation réelles. Elles ont été vérifiées par le code et les conditions de rendu, mais pas exécutées avec un compte QA pendant cette passe. Les protections d’authentification, de rôle et de données privées ne constituent pas des verrous de modification et doivent être conservées.

## Complément de couverture de l’accueil

`src/pages/Index.tsx` monte effectivement `Header`, `HeroSection`, `SearchForm`, `WhySection`, `HowItWorksSection`, `ServicesSection`, `UserTypesSection`, `UseCasesSection`, `HomeFAQSection`, `Footer` et `FloatingContact`. La section active `UseCasesSection` contient des situations éditoriales sans chiffres, avis, garanties ou résultats présentés comme acquis. Le scan global doit toutefois encore traiter les anciens composants de confiance repérés par recherche textuelle, car leur présence dans les sources ne suffit pas à conclure à leur accessibilité.

## Mise à jour de finition

Le bouton Accompagnateur actif affiche désormais `GO · Démarrer la mission` et conserve la transition réelle via preuve photo, stockage privé et RPC atomique. Le suivi Propriétaire affiche `Suivre la demande` et ouvre le détail de la réservation réelle.

Le héros mobile de `/walkers` a été corrigé : sa hauteur minimale et son espacement vertical empêchent désormais le titre, les indicateurs et le bouton d’annonce d’être rognés. La recette CDP après hydratation ne signale aucune exception, erreur console ou spinner persistant sur les routes clés.

Les composants non importés par les routes actives et contenant des contenus historiques non factuels ont été retirés : anciennes sections de confiance, badges, maquette Accompagnateur, suivi live historique, onglet de performance et onglet de parrainage. Le tableau Accompagnateur actif n’affiche pas les revenus ni la performance simulée.

Les contrôles locaux passent après ces changements : `git diff --check`, typecheck, lint, build de production et audit des dépendances. La recette protégée reste limitée à l’accès anonyme ; les mutations nécessitant un compte QA réel n’ont pas été exécutées.
