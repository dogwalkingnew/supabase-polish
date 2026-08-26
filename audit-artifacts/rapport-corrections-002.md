# DogWalking — Rapport de corrections 002

**Date :** 26 août 2026  
**Périmètre :** recherche d’accompagnateurs, annonces libres, contenus d’authentification et pied de page.

## Corrections appliquées

| Référence | Correction | Preuve |
|---|---|---|
| C-006 | Les quatre annonces, propriétaires, prix, statuts et actions « Postuler » codés en dur ont été retirés de `/walkers`. | Le navigateur affiche désormais un état honnête avec accès vers le parcours dédié `/annonces-libres`. |
| C-007 | Le héros de recherche n’affiche plus de sélection manuelle, taux de certification, volume d’accompagnateurs ni note moyenne non calculés depuis des données réelles. | Contrôle navigateur de `/walkers`. |
| C-008 | La page `/annonces-libres` n’annonce plus Stripe, paiement en attente, commissions ni reversements. | Contrôle navigateur après correction. |
| C-009 | Le dépôt d’annonce libre récupère désormais un `dog_id` réel avant l’insertion, et bloque avec un message exploitable si le propriétaire n’a pas encore d’animal. | Contrat Supabase contrôlé : `dog_id` est obligatoire dans `bookings`. |
| C-010 | Les services du formulaire sont alignés sur les quatre valeurs réellement autorisées par l’énumération Supabase : `promenade`, `garde`, `visite`, `veterinaire`. | Lecture directe de l’énumération Supabase. |
| C-011 | Les promesses non vérifiées de la page d’inscription et du footer ont été retirées, de même que les liens sociaux et le numéro de téléphone de démonstration. | Contrôle de code et rendu public. |

## Vérifications réalisées

| Contrôle | Résultat |
|---|---|
| TypeScript | `pnpm exec tsc --noEmit --pretty false` : réussi. |
| Build de production | `pnpm run build` : réussi. |
| Recherche `/walkers` | La section des fausses annonces est remplacée par un accès explicite au parcours dédié. |
| Annonces libres `/annonces-libres` | Le message explicite l’absence de paiement intégré ; l’état vide apparaît après chargement sans boucle. |
| Inscription QA | La validation frontale et le retour Auth ont été vérifiés. Le domaine de test utilisé est refusé par Supabase, donc aucun compte ni profil QA n’a été créé. |

## Point bloquant à lever pour les tests finaux

Pour vérifier les dashboards et les droits RLS en conditions réelles sans toucher aux utilisateurs existants, il faut une adresse QA valide et contrôlable, ou un environnement Supabase de recette avec Auth dédié. Aucun mot de passe, utilisateur métier ni donnée existante n’a été modifié pendant cet essai.

## Suite prioritaire

1. Fournir une boîte QA contrôlable ou valider un environnement de recette, puis exécuter les tests propriétaire, accompagnateur et administrateur.
2. Terminer le nettoyage des pages secondaires qui affichent encore des affirmations de paiement, remboursement, sélection ou avis non prouvées.
3. Réexaminer les alertes Supabase : protection contre mots de passe compromis et fonctions `SECURITY DEFINER` ouvertes à `authenticated`.
4. Tester les seuils responsive restants et les dashboards avec une session QA réelle.
