# DogWalking — Rapport de corrections 001

**Date :** 26 août 2026  
**Périmètre :** ouverture de l’environnement, démarrage réel, intégration Supabase, fiabilité du tableau de bord propriétaire et transparence du contenu public.

## Décision de cette vague

La version est **vérifiable publiquement** et l’accueil s’affiche réellement dans le navigateur. Cette vague ne constitue pas encore un feu vert de production : les parcours authentifiés, les politiques RLS, les fonctions métier et la configuration Stripe doivent encore faire l’objet de tests réels dédiés.

## Corrections appliquées

| Référence | Correction | Vérification réalisée |
|---|---|---|
| C-001 | Autorisation du domaine temporaire dans la configuration de développement. | L’hôte exposé répond et l’accueil est rendu dans le navigateur. |
| C-002 | Rétablissement de la configuration client Supabase pour la prévisualisation, avec priorité aux variables d’environnement et repli uniquement sur les identifiants publics du projet connecté. | L’initialisation d’authentification ne provoque plus de page d’erreur ; les composants publics sont rendus. |
| C-003 | Remplacement des jointures `bookings → profiles` et `walker_profiles → profiles` inexistantes par des requêtes en deux étapes et un mapping explicite. | `pnpm exec tsc --noEmit` est valide après correction. |
| C-004 | Retrait des statistiques, notes, avis, identité d’experte, certifications et lien LinkedIn non vérifiés de l’accueil. | L’accueil conserve sa structure et ses CTA sans preuves sociales fabriquées. |
| C-005 | Correction des promesses de paiement, garanties absolues et états obligatoires non justifiés dans le héros, les cartes de services, le bloc de confiance et les métadonnées publiques. | Contrôle navigateur réalisé après mise à jour. |

## Vérifications techniques

| Contrôle | Résultat |
|---|---|
| TypeScript | `pnpm exec tsc --noEmit --pretty false` : réussi. |
| Build de production | `pnpm run build` : réussi. |
| Accueil public | Rendu réel dans le navigateur, navigation et menu Services ouverts. |
| Responsive mobile | Accueil capturé à **375 × 812 px** ; aucun débordement horizontal visible sur la capture. |
| Supabase | Projet actif identifié, tables et relations cartographiées, politiques RLS actives sur les principales tables. |

## Travaux restant avant un feu vert production

| Priorité | Sujet | Action nécessaire |
|---|---|---|
| P0 | Paiements et Stripe | Les fonctions Edge et le flux de paiement réellement déployé ne sont pas présents. Les anciennes promesses restantes doivent être retirées des routes secondaires, puis tout paiement futur devra être développé et testé de bout en bout avant d’être annoncé. |
| P0 | Tests multi-rôles réels | Créer des comptes QA propriétaire, accompagnateur et administrateur ; tester création, lecture, modification, annulation, messages, preuves, démarrage et clôture avec des données `QA_TEMP_`. |
| P0 | Sécurité Auth | L’alerte Supabase sur la protection contre les mots de passe compromis reste active et doit être corrigée dans la configuration Auth. |
| P1 | RPC `SECURITY DEFINER` | Les fonctions métier sont signalées comme accessibles à `authenticated`. Elles doivent être testées avec des utilisateurs QA sur les contrôles d’identité et de rôle avant toute révocation ou modification. |
| P1 | Contenu public secondaire | Les pages Tarifs, Support et certains services comportent encore des formulations sur le paiement, le remboursement, les fonds ou des avis qui ne sont pas encore rectifiées. |
| P1 | Responsive complet | Étendre la vérification à 320, 390, 430, 768, 1024, 1280, 1440 et 1920 px, puis aux dashboards authentifiés. |
| P2 | Actifs locaux | Déplacer les images locales vers le stockage web durable avant une mise en ligne définitive afin d’éviter un déploiement lourd. |
| P2 | Lint | Le lint global remonte actuellement un volume important d’erreurs de formatage et de règles historiques, alors que le typage et le build passent. Il faut le normaliser progressivement par domaine fonctionnel, sans masquer les erreurs. |

## Sources de preuve

Les résultats de navigateur sont consignés dans `audit-artifacts/controle-navigateur-initial.md`. Les contrôles de type et de build ont été exécutés directement sur cette révision.
