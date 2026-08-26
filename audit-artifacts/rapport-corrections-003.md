# DogWalking — Rapport de corrections 003

**Date :** 26 août 2026  
**Périmètre :** recherche d’accompagnateurs, liste de profils et formulaire d’annonce rapide.

## Corrections appliquées

| Référence | Correction | Vérification |
|---|---|---|
| C-012 | Suppression de la carte à épingles simulée et des contrôles de carte sans données géographiques réelles. | La recherche desktop affiche une liste complète, sans prétendre proposer une carte interactive. |
| C-013 | Suppression de la disponibilité, du délai de réponse, du favori local, du tarif par défaut et du profil « certifié » fictifs dans la liste d’accompagnateurs. | La liste ne présente plus que les champs disponibles dans Supabase. |
| C-014 | Notes et avis rendus conditionnels à l’existence de valeurs réelles ; suppression des badges et des filtres artificiels. | Aucun avis ou score n’est affiché lorsque les données sont nulles ou à zéro. |
| C-015 | Suppression du paiement, wallet, recharge de crédit et promesse de débit différé simulés du formulaire de demande rapide. | Le récapitulatif publie directement l’annonce, sans action financière annoncée. |
| C-016 | Services du formulaire rapide alignés sur l’énumération Supabase et libellé de localisation modifié en « ville ou zone ». | Insertion `bookings` avec `dog_id` et service compatible. |

## Vérifications techniques

| Contrôle | Résultat |
|---|---|
| TypeScript | `pnpm exec tsc --noEmit --pretty false` : réussi. |
| Build de production | `pnpm run build` : réussi. |
| Recherche `/walkers` | Rendu navigateur vérifié avec formulaire sans paiement, liste vide explicite et CTA accessibles. |
| Responsive public | Accueil, recherche et annonces contrôlés à 375 × 812 px sans débordement horizontal visible. |

## Points restant à traiter

| Priorité | Élément | Action |
|---|---|---|
| P0 | Tests authentifiés | Fournir une boîte QA valide et contrôlable ou une recette Supabase dédiée. Le domaine de test neutre est refusé par Auth. |
| P0 | Paiements réels | Stripe n’est pas configuré : le système ne doit pas annoncer de paiement, remboursement, commission, reversement ou séquestre tant qu’un flux server-side sécurisé et testé n’existe pas. |
| P1 | Pages secondaires | Revoir Tarifs, Support, services détaillés et parcours accompagnateur pour retirer les dernières affirmations similaires. |
| P1 | Politique Supabase | Traiter l’alerte de protection contre les mots de passe compromis et valider les fonctions `SECURITY DEFINER` avec des comptes QA avant tout changement de rôle. |
| P2 | Actifs de production | Déplacer les médias locaux vers le stockage durable de l’application avant publication définitive. |
