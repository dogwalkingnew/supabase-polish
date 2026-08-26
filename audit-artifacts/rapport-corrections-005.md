# DogWalking — Rapport de corrections 005

**Date :** 26 août 2026  
**Périmètre :** demande de prestation, confidentialité RLS, cohérence visuelle et non-régression de production.

## Changements livrés

| Référence | Correction | Contrôle associé |
|---|---|---|
| C-023 | Le flux `/book/:walkerId` ne déclenche plus Stripe, paiement sécurisé, séquestre, code de fin de mission, frais, commissions ou protection fictive. Il crée une demande puis demande de confirmer le prix, le créneau et les conditions avec l’Accompagnateur. | TypeScript et build de production réussis. |
| C-024 | Les évaluations, labels de certification et garanties statiques ont été retirés de la carte de réservation lorsque leur disponibilité n’est pas démontrée par le parcours. | Contrôle de code du composant `BookWalk`. |
| C-025 | La politique RLS `Dogs are viewable by authenticated users` a été remplacée dans Supabase par `Participants can view relevant dogs`. | Migration `secure_dogs_select_policy` appliquée avec succès et vérifiée en lecture seule. |
| C-026 | L’accès aux animaux est maintenant limité à leur propriétaire, aux Accompagnateurs associés à une réservation et aux administrateurs. | Lecture post-migration de `pg_policies`. |
| C-027 | Les pages publiques, les filtres et les cartes opérationnelles utilisent le vert forêt DogWalking comme action principale, avec des surfaces sable et un motif de parcours discret. | Contrôle visuel final de `/`, `/walkers` et `/annonces-libres`. |
| C-028 | Les cas d’usage de l’accueil décrivent désormais la préparation d’une demande et la confirmation des modalités, sans garantie, suivi ou intervention automatique non disponible. | Contrôle visuel et build de production. |

## Contrôles conclusifs

| Test | Résultat |
|---|---|
| TypeScript | `pnpm exec tsc --noEmit --pretty false` réussi. |
| Build de production | `pnpm run build` réussi après toutes les corrections. |
| Parcours publics | Accueil, recherche, annonce libre, promenade et ressources légales contrôlés dans le navigateur. |
| Responsive | Garde à domicile et marche régulière contrôlées à 375 × 812 px. |
| Supabase | Schéma, alertes de sécurité, alertes de performance, fonctions sensibles et politiques RLS principales examinés. |

## Points obligatoires avant mise en ligne réelle

| Niveau | Point à clôturer | État |
|---|---|---|
| P0 | Créer des comptes QA réellement contrôlables pour un Propriétaire, un Accompagnateur et un Administrateur, puis rejouer l’inscription, la création d’animal, la demande, la candidature, l’acceptation, l’annulation et l’accès aux données. | Bloqué par l’absence de comptes QA valides. |
| P0 | Traiter les alertes Supabase restantes : `pg_net` dans `public`, fonctions `SECURITY DEFINER` publiques et protection des mots de passe compromis désactivée. | Audité ; migration non appliquée sans tests de rôles. Voir `controle-securite-supabase-20260826.md`. |
| P0 | Compléter puis faire valider les mentions légales, CGU et politique de confidentialité avec les données réelles de l’éditeur, de l’hébergement final et du responsable de traitement. | Projet de texte préparé, non publiable en l’état. |
| P1 | Réexaminer les modules historiques de portefeuille, commissions, Stripe, litiges et rapports avant toute réactivation ; ils ne doivent pas être présentés comme disponibles. | À valider dans une recette QA dédiée. |
| P1 | Remplacer les médias locaux par des URLs de stockage durable avant publication si la chaîne de déploiement l’exige. | À vérifier au moment de la publication. |

## Évaluation de l’état actuel

La partie publique est stabilisée : elle ne fait plus de promesse de paiement, de commission, de remboursement, d’avis, de certification ou de protection non démontrée. Les résultats de recherche, les états vides et les demandes affichent désormais un parcours cohérent avec les fonctions visibles. La compilation de production est validée.

Le niveau « prêt pour exploitation complète » dépend encore d’un jeu de comptes QA, de la validation des autorisations par rôle et de la clôture des sujets de conformité et de sécurité listés ci-dessus. Il serait imprudent de réactiver les modules financiers ou de publier les documents légaux définitifs sans ces validations.
