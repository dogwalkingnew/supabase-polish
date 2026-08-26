# DogWalking — Rapport de finalisation QA, sécurité et contenu public

**Date : 27 août 2026**  
**Statut : vague de correction finalisée, publication encore conditionnelle**

## Synthèse

Cette vague a consolidé les parcours de comptes QA, les contrôles d’accès Supabase, les protections contre les flux de paiement obsolètes et les pages publiques. Le principe appliqué est simple : une fonction n’est présentée comme disponible que lorsqu’elle a été observée dans l’application ou testée sur des données QA isolées. Les promesses de paiement, séquestre, assurance, certification, chiffres de couverture, support garanti et statistiques non vérifiées ont été retirées des parcours corrigés.

| Domaine | Résultat vérifié | État |
|---|---|---|
| Inscription existante | Une adresse déjà existante ne déclenche plus de fausse réussite visuelle | Validé |
| Rôles QA | Propriétaire et Accompagnateur autorisés ; Administrateur créé et rôle attribué | Validé, confirmation email Admin à effectuer |
| Demande et candidature | Refus Accompagnateur non validé, candidature validée, acceptation Propriétaire et notification contrôlées | Validé avec données `QA_TEMP_` |
| RLS Chien / Réservation | Propriétaire, Accompagnateur associé et Administrateur autorisés ; tiers refusé | Validé |
| Compilation | TypeScript et build de production passent | Validé |
| Pages publiques | Zones, choix d’espace, présentation, support, réservation, messagerie et exports assainis | Validé visuellement et à la compilation |

## Comptes QA et scénario de preuve

Les deux premières adresses fournies correspondaient à des comptes déjà présents. Avec votre autorisation, le compte Accompagnateur a été réaffecté de façon ciblée ; aucun doublon n’a été créé. Le compte Administrateur a été créé avec la troisième adresse et le rôle `admin` a été attribué en complément de son rôle utilisateur. Son email doit encore être confirmé avant le test de connexion navigateur réel.

Le scénario isolé a créé un animal et une demande préfixés `QA_TEMP_`. Les vérifications ont confirmé le refus d’une candidature par un profil Accompagnateur non validé, puis le déroulement contrôlé de la candidature, de l’acceptation par le Propriétaire et de la notification correspondante. Les tests RLS ont confirmé la visibilité attendue de l’animal et de la demande pour les trois rôles concernés, avec refus pour un tiers non associé.

> Les données `QA_TEMP_` sont conservées temporairement pour vos propres essais sur la prévisualisation. Elles devront être supprimées de manière ciblée après validation fonctionnelle finale.

## Sécurité Supabase

Une tâche planifiée historique de libération de fonds appelait un flux de paiement non déployé via `pg_net`. Elle a été désactivée, puis l’extension `pg_net` a été retirée après vérification de l’absence de fonctions métier et de fonctions Edge actives qui en dépendaient. Le contrôle post-migration confirme l’absence de l’extension et de la tâche obsolète.

La fonction de rôle interne `has_role` a été déplacée hors du schéma REST public, puis les politiques testées ont été rejouées avec succès. Treize fonctions `SECURITY DEFINER` non appelées par le code actif ont perdu l’exécution REST accordée aux utilisateurs authentifiés. L’analyseur de sécurité ne signale plus ces expositions ; la seule alerte restante concerne la protection contre les mots de passe compromis, qui est un réglage Auth à activer dans Supabase et qui nécessite un plan compatible selon la documentation officielle.[1]

| Action | Effet contrôlé |
|---|---|
| Suppression de `pg_net` et de la tâche de paiement | Élimine un appel historique à une fonction non déployée et le privilège associé |
| Déplacement de `has_role` dans un schéma privé | Retire cette fonction de l’API REST publique tout en conservant les accès RLS QA |
| Révocation RPC de fonctions non utilisées | Réduit la surface d’appel externe des routines `SECURITY DEFINER` |
| Contrôle post-migration | Seule l’alerte de protection des mots de passe compromis demeure |

## Ajustements du produit et des contenus

Le formulaire d’inscription traite désormais le cas Supabase d’une adresse existante sans annoncer de création réussie. Les redirections du choix d’espace ont été alignées sur les tableaux de bord actifs. Les actions UI non reliées de téléphone, vidéo et menu ont été retirées de la messagerie. La libération de fonds a été retirée du détail de réservation après neutralisation de l’ancien flux de paiement.

Les pages légales ont été rendues explicitement provisoires. Un dossier de préparation à la validation externe est disponible sous `audit-artifacts/dossier-legal-validation-externe.md`. Les coordonnées, l’éditeur, le domaine de production et les règles de conservation ne sont pas inventés.

## Préconditions avant publication

La prévisualisation est prête pour vos essais, mais la publication ne doit pas encore être considérée comme complète. Les actions suivantes restent nécessaires : confirmer l’email du compte Administrateur puis tester sa connexion réelle ; activer la protection des mots de passe compromis dans le tableau de bord Supabase si votre plan le permet ; fournir les éléments légaux réels ; faire relire les textes par un professionnel compétent ; enfin, supprimer les données `QA_TEMP_` après la validation.

Le lint global historique n’est pas déclaré propre : il contient de nombreux écarts de style antérieurs au périmètre de cette vague. Les contrôles retenus pour cette livraison sont TypeScript, build de production, tests QA de rôles/RLS et contrôles visuels des pages corrigées.

## Références

[1]: https://supabase.com/docs/guides/auth/password-security "Supabase — Password security"
