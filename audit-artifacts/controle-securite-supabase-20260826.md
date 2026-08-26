# DogWalking — Contrôle sécurité Supabase

**Projet contrôlé :** `Front et backend dogwalking` (`aqitjhaotpautjywoeys`)  
**Date :** 26 août 2026  
**Méthode :** contrôles en lecture seule ; aucune migration, permission ou donnée n’a été modifiée.

## Résumé des alertes

| Priorité | Constat | État de vérification | Action recommandée |
|---|---|---|---|
| Haute | `pg_net` est installé dans le schéma `public`. | Alerte Supabase confirmée. | Déplacer l’extension hors du schéma exposé dans une migration contrôlée, puis vérifier les dépendances. [Référence Supabase](https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public) |
| Haute | Plusieurs fonctions `SECURITY DEFINER` sont exécutables par `authenticated`. | Alerte Supabase confirmée pour les fonctions de réservation, contact, rapport, GPS et code de mission. | Tester chaque chemin avec un Propriétaire, un Accompagnateur, un Administrateur et un tiers QA ; conserver seulement les droits nécessaires. [Référence Supabase](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable) |
| Haute | La protection contre les mots de passe compromis est désactivée dans Supabase Auth. | Alerte Supabase confirmée. | L’activer dans les paramètres Auth après vérification de l’impact sur les utilisateurs et l’inscription. [Référence Supabase](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) |

## Fonctions inspectées

Les définitions de cinq fonctions à privilèges ont été contrôlées. `accept_booking_application`, `apply_to_open_booking`, `get_booking_contact`, `has_role` et `trigger_sos_release` effectuent toutes un contrôle de l’utilisateur authentifié dans leur logique avant les opérations métier. Cela réduit le risque immédiat, mais ne remplace pas un test multi-rôles réel : les autres fonctions signalées par Supabase doivent encore être contrôlées de la même manière, notamment celles qui modifient le statut d’une réservation, enregistrent une trace GPS ou une preuve de mission.

> Les fonctions de paiement et de protection financière historiques ne doivent pas être exposées au public tant qu’un flux de paiement sécurisé, des rôles QA et des tests de non-régression ne sont pas disponibles.

## Condition de clôture

La correction de ces alertes nécessite des comptes QA distincts et un test explicite des autorisations. Aucune révocation générale de `EXECUTE` ni conversion vers `SECURITY INVOKER` ne doit être appliquée sans vérifier les usages de l’interface et les politiques RLS associées.

## Correction RLS appliquée

L’ancienne politique `Dogs are viewable by authenticated users` autorisait tout utilisateur authentifié à lire l’ensemble des profils d’animaux. Elle a été supprimée dans la migration `secure_dogs_select_policy`.

La politique de remplacement `Participants can view relevant dogs` limite désormais la lecture à :

| Lecteur | Condition d’accès |
|---|---|
| Propriétaire | Il est propriétaire du profil d’animal. |
| Accompagnateur | Il est associé à une réservation qui concerne cet animal. |
| Administrateur | Son rôle applicatif est `admin`. |

Le contrôle post-migration confirme que cette politique est active, en complément de la politique propriétaire existante. Une validation multi-rôles reste nécessaire pour vérifier les parcours de réservation dans une recette QA.
