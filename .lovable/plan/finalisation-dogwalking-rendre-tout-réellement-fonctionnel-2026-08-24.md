# Finalisation DogWalking — rendre tout réellement fonctionnel

## État constaté aujourd'hui

- Le site public, l'authentification et les pages « annonces libres / réservation directe » sont bien branchés sur la base.
- Le build passe, la base contient les 20 tables avec sécurité (RLS) et les fonctions métier (code GO, SOS, libération auto 72 h).
- **Les deux tableaux de bord affichés (propriétaire `/dashboard` et accompagnateur `/walker/dashboard`) sont encore des maquettes** : animaux, missions, revenus, factures, avis sont écrits en dur dans le code.
- **Aucun paiement n'est opérationnel** : le code appelle des fonctions Stripe qui n'existent nulle part.
- Boutons morts (mot de passe, 2FA, déconnexion), suivi GPS simulé, contenus québécois résiduels, pages en double non utilisées.
- Base vide : aucun parcours n'a jamais été testé en réel.

## Ce qui sera fait

### Lot 1 — Brancher le dashboard propriétaire aux vraies données
- Animaux, prochaine mission, historique, favoris, alertes : lecture réelle depuis la base pour l'utilisateur connecté.
- Ajout/modification/suppression d'un chien depuis l'onglet « Mes animaux ».
- Onglet Missions : recherche et filtres réellement actifs, accès au détail et à la messagerie.
- Facturation : factures générées à partir des réservations payées, téléchargement PDF.
- Profil : édition enregistrée en base, préférences de notification persistées, changement de mot de passe réel, déconnexion réelle (le 2FA sera masqué tant qu'il n'est pas supporté).

### Lot 2 — Brancher le dashboard accompagnateur
- Statut en ligne/hors ligne persistant, missions du jour, planning réel, missions libres et candidatures.
- Revenus réels (jour / semaine / mois, détail par mission, versements) calculés depuis la base.
- Profil éditable (tarif, rayon, services, disponibilités), badges et note réels.
- Onglet Paramètres construit (notifications, compte, documents).
- Contenus québécois remplacés par du contenu français.

### Lot 3 — Paiements réellement fonctionnels
- Chaîne de paiement reconstruite côté serveur de l'application (pas d'edge functions) : paiement propriétaire avec fonds bloqués, libération par le code à 6 chiffres, remboursement, annulation, webhook de synchronisation, versement à l'accompagnateur via Stripe Connect.
- Règles tarifaires appliquées : +5 % côté propriétaire, −13 % côté accompagnateur.
- Nécessite votre validation pour connecter Stripe (clés).

### Lot 4 — Mission en direct et preuves
- Démarrage de mission avec photo obligatoire, chrono et étapes réelles, photos de promenade stockées, code GO de fin, notifications.
- Suivi de position réel si autorisé par le navigateur, sinon état « position indisponible » clair (plus de GPS simulé).

### Lot 5 — Sécurité, cohérence, nettoyage
- Audit des fonctions sensibles (notamment le partage des coordonnées), protection des mots de passe compromis activée.
- Règle « accompagnateur vérifié » exigée pour postuler, alignée sur la promesse de sélection.
- Suppression des pages en double non utilisées et unification de la source du schéma de base.

### Lot 6 — Test de bout en bout réel
- Parcours complet joué dans l'application : inscription propriétaire + accompagnateur, ajout chien, annonce, candidature, acceptation, paiement, mission, code de fin, libération des fonds, avis, facture.
- Correction de tout ce qui bloque, jusqu'à un parcours qui passe intégralement.

## Détails techniques

- Données via TanStack Query + client Supabase existant ; logique serveur via `createServerFn` (webhook Stripe en route `api/public`).
- Stockage des photos et documents dans les buckets déjà créés, avec URLs signées.
- Aucun changement de design : uniquement le branchement et les fonctionnalités manquantes.

## Ordre proposé

Lot 1 → Lot 2 → Lot 4 → Lot 3 (dès Stripe connecté) → Lot 5 → Lot 6.
