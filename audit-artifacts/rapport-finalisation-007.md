# DogWalking — Rapport de clôture contrôlée 007

**Date :** 27 août 2026  
**Statut :** corrections applicatives publiables finalisées ; publication de production encore conditionnelle.

## Synthèse de la passe finale

Cette passe a fermé les derniers écarts de cohérence qui pouvaient donner l’impression que DogWalking traitait des paiements, rémunérations, remboursements, certifications ou disponibilités qui ne sont pas réellement opérés. Les écrans corrigés sont maintenant explicites : une demande est envoyée, son montant est indicatif et les modalités sont confirmées entre les personnes concernées. Aucun paiement n’est engagé par l’application.

| Domaine | Correction appliquée | Validation |
|---|---|---|
| Demande directe | Les libellés « Confirmer et payer », séquestre et paiement sécurisé ont été remplacés par un envoi de demande et un montant indicatif | TypeScript et build validés |
| Annulation | L’ancien appel de remboursement Stripe a été supprimé ; l’annulation ne modifie plus que l’état métier et le motif | TypeScript et build validés |
| Candidature Accompagnateur | Les promesses de certification, sélection chiffrée, paiement, revenu garanti et délai garanti ont été retirées | Contrôle visuel desktop et mobile |
| Espace Accompagnateur | Le tableau V3 de démonstration a été remplacé par les réservations réellement attribuées et l’état de validation réel du profil | TypeScript et build validés |
| Fiches publiques | Les valeurs par défaut de note, prestations, rayon, tarif, temps de réponse et certification ont été supprimées | TypeScript et build validés |
| Administration | Les commissions, revenus et onglets financiers non opérés ont été retirés au profit de métriques opérationnelles | TypeScript et build validés |
| Profil et Auth | Les boutons non reliés de sécurité, notification et photo ont été neutralisés ; le vert forêt est désormais le repère d’action et de sélection | Contrôle visuel mobile |
| SEO et contenu | Les métadonnées globales et les appels à l’action d’annonces ne présentent plus de paiement ni de certification active | Balayage ciblé des sources |

## Contrôles effectués

Les contrôles de compilation ont réussi avec `pnpm exec tsc --noEmit --pretty false` et `pnpm run build`. Le diff Git ne contient plus d’erreur d’espacement. Les parcours publics Auth, candidature Accompagnateur et recherche ont été contrôlés sur mobile ; l’état vide de recherche comporte désormais une explication et des actions qui correspondent à des routes réelles.

La matrice QA antérieure demeure le référentiel de contrôle des droits : Propriétaire, Accompagnateur associé et Administrateur autorisés, tiers non associé refusé sur les ressources Chien et Réservation. Les mécanismes Supabase obsolètes déjà retirés, dont `pg_net`, la tâche historique de libération de fonds et les fonctions RPC non utilisées, restent clôturés.[1]

## Pré-requis qui ne peuvent pas être prétendus comme terminés

La présente passe ne remplace pas les informations, décisions et opérations qui doivent venir de l’éditeur. Elles doivent rester explicitement bloquées avant toute publication de production.

| Priorité | Prérequis | Pourquoi il reste ouvert |
|---|---|---|
| P0 | Confirmation de l’email Administrateur QA et connexion administrateur réelle | L’identité a été créée et le rôle attribué, mais le contrôle de session doit être fait depuis la boîte email concernée. |
| P0 | Protection Supabase des mots de passe compromis | Réglage Auth externe à activer dans le tableau de bord Supabase, avec plan compatible selon la documentation Supabase.[2] |
| P0 | Mentions légales, CGU, confidentialité et RGPD | L’éditeur, l’adresse, le SIRET, le contact, le DPO, le domaine/hébergeur et les règles réelles n’ont pas été fournis ; ils ne peuvent pas être inventés. |
| P0 | Décision métier sur les paiements | Le paiement intégré est volontairement absent. Toute future activation exige Stripe, règles fiscales, remboursements, support, CGU et tests de bout en bout. |
| P1 | Modèle unique de candidature Accompagnateur | Le formulaire crée `walker_profiles` en attente tandis que l’administration lit aussi `walker_applications`. Ces deux flux doivent être unifiés avant d’autoriser une validation documentaire de production. |
| P1 | Réponse à une demande directe et contre-proposition | Le scénario est cartographié mais l’écran et la transaction d’accepter, refuser ou versionner une contre-proposition doivent être implémentés et testés. |
| P1 | Disponibilités réelles | L’affichage ne doit pas être confondu avec un moteur de disponibilité. Une règle de conflit, une persistance et un contrôle transactionnel restent nécessaires. |
| P1 | Nettoyage QA | Les données préfixées `QA_TEMP_` restent disponibles pour vos tests ; elles doivent être supprimées de manière ciblée après validation finale. |

## Décision de mise en ligne

> **Décision recommandée :** la prévisualisation peut être testée maintenant. La publication de production ne doit être effectuée qu’après résolution des prérequis P0 et validation explicite du propriétaire du projet. Les parcours non implémentés sont désormais présentés comme indisponibles ou à confirmer, plutôt que comme actifs.

## Références

[1]: rapport-corrections-006.md "Contrôles QA, sécurité Supabase et neutralisation des mécanismes obsolètes"

[2]: https://supabase.com/docs/guides/auth/password-security "Supabase — Password security"
