# DogWalking — Rapport de contrôle vague 019

## Objet

Cette vague corrige le défaut signalé sur ordinateur : le tableau Propriétaire utilisait encore une composition principalement mobile, avec plusieurs conteneurs limités à `max-w-lg`. Sur grand écran, cette contrainte créait une colonne étroite et laissait une grande quantité d’espace inutilisé. Le mobile déjà jugé satisfaisant devait rester inchangé.

## Corrections appliquées

| Zone | Avant | Après | Effet attendu |
|---|---|---|---|
| Accueil Propriétaire | Contenu principal limité à `max-w-lg` | Conteneur fluide jusqu’à `max-w-7xl`, avec marges responsives | Meilleure occupation de la largeur desktop |
| Cartes animaux | Deux colonnes à tous les formats | Deux colonnes mobile, quatre colonnes desktop | Densité adaptée à l’espace disponible |
| Shell du tableau | Largeur non explicitement structurée | `w-full`, `max-w-[1600px]`, espacements desktop progressifs | Alignement cohérent des onglets |
| Navigation basse | Barre interne limitée à `max-w-lg` | Barre interne jusqu’à `max-w-4xl`, avec espacement desktop | Navigation moins comprimée sur ordinateur |
| Profil Propriétaire | En-tête et contenu limités à `max-w-lg` | En-tête et contenu jusqu’à `max-w-7xl` | Onglet Profil lisible sur grand écran |

Les actions métier n’ont pas été remplacées ni simulées. L’action **« Suivre la demande »** reste reliée à la réservation réelle fournie par `useOwnerDashboard`, et les actions de gestion d’animaux restent connectées à Supabase.

## Contrôles réalisés

Le typecheck et le build de production passent après modification. Le lint passe sans erreur bloquante ; les avertissements historiques liés aux types génériques et aux dépendances de hooks restent documentés, sans nouveau warning introduit par cette vague. Les captures desktop des pages publiques `/`, `/walkers` et `/auth` ont été contrôlées à 1440×900. Les captures mobile des mêmes pages ont été contrôlées à 390×844 et ne montrent pas de régression de structure ou de débordement manifeste.

La session navigateur Propriétaire connectée n’a pas pu être rejouée dans cette itération : l’extension du navigateur partagé a retourné un délai 504 lors de l’ouverture du tableau. Il reste donc à exécuter manuellement, avec la session réelle déjà connectée, le parcours `/dashboard` puis **Suivre la demande** vers `/bookings/:id`. Aucun mot de passe n’a été demandé ni enregistré.

## Fichiers modifiés

- `src/pages/dashboard/OwnerDashboardV3.tsx`
- `src/components/dashboard-v3/OwnerHomeImproved.tsx`
- `src/components/dashboard-v3/OwnerProfileComplete.tsx`
- `todo.md`

## Prévisualisation

Le serveur de prévisualisation est disponible à l’adresse temporaire communiquée dans le fil de discussion. La version actuelle correspond au projet DogWalking synchronisé avant création du prochain checkpoint.

## Limites opérationnelles restantes

La validation d’une mutation réelle, notamment le clic **Suivre** sur une réservation existante, nécessite une session navigateur fonctionnelle et une donnée de réservation QA autorisée par les politiques RLS. La publication du domaine Lovable reste également dépendante de son redéploiement externe ; la prévisualisation locale ne peut pas prouver la propagation de ce domaine.

## Synchronisation GitHub — vague 020

Le dépôt `dogwalkingnew/supabase-polish` a été cloné et comparé à la révision précédente `aa76c9a`. Le transfert a été réalisé avec `git push --force-with-lease` vers `main`. Le SHA final vérifié localement et sur GitHub est `5c04845d7645c8299e5cf5dbe9a598d5fff06f62`. La CI GitHub associée à ce SHA est terminée avec succès : installation verrouillée, typecheck, lint, build de production et audit des dépendances passent. Les annotations restantes sont des avertissements de lint existants et l’avertissement de dépréciation Node.js 20 des actions GitHub, sans échec de contrôle.

Une archive source suivie par Git a été ajoutée au dépôt sous `audit-artifacts/dogwalking-source-c92d5ba.zip`. Elle contient la source suivie de la révision précédente sans artefacts de build ou fichiers locaux non suivis. Le code de production reste séparé de cette archive afin de ne pas ralentir le déploiement statique.

Les tâches qui exigent encore un accès externe réel ne sont pas déclarées terminées : configuration et redéploiement Lovable, activation de la protection contre les mots de passe compromis, validation juridique et opérationnelle, confirmation e-mail Admin, ainsi que la recette navigateur authentifiée du bouton « Suivre » et du bouton « GO ».

## Passe desktop complémentaire — vague 021

La composition de l’accueil Propriétaire utilise maintenant une grille à deux colonnes sur desktop : le bouton principal s’étend sur toute la largeur, tandis que les animaux et la prochaine demande occupent des colonnes équilibrées. Le tableau Accompagnateur actif a été élargi de `max-w-5xl` à `max-w-7xl`. Les pages publiques ont été revues à 1440×900 et 390×844 ; le mobile conserve son empilement et ses contrôles tactiles.

### QA restante à exécuter avec comptes réels

| Parcours | État | Contrôle attendu |
|---|---|---|
| Public | Contrôlé automatiquement | Accueil, recherche, services, aide, authentification et redirections principales sans écran de chargement persistant |
| Propriétaire — navigation | À rejouer en session | Accueil, Animaux, Missions, Profil, liens `?tab=chiens`, `?tab=reservations`, `?tab=profil` |
| Propriétaire — Suivre | À rejouer en session | Une réservation réelle apparaît, le bouton ouvre `/bookings/:id`, puis les données accessibles respectent le rôle |
| Propriétaire — données | À rejouer en session | Ajouter, modifier, supprimer un animal ; modifier le profil ; changement de mot de passe avec succès et erreur |
| Accompagnateur — GO | À rejouer en session | Une réservation `confirmed` attribuée permet l’ouverture de la preuve, le téléversement privé et la transition RPC ; l’absence de preuve est refusée |
| Accompagnateur — réponses | À rejouer en session | Accepter/refuser uniquement une demande attribuée et vérifier la notification Propriétaire |
| Administrateur | À rejouer en session | Accès au tableau, filtres, validation de dossier, rapport/export et refus des accès non administrateur |
| Sécurité | À rejouer en session | RLS avec propriétaire, accompagnateur associé, administrateur et tiers non associé ; aucun accès croisé |
| Lovable | Externe | Variables publiques Supabase, redéploiement, accueil et route profonde sur le domaine publié |
| Exploitation/légal | Externe | Email Admin, mots de passe compromis, informations éditeur, RGPD, domaine, sauvegardes et observabilité |

## Preuve QA observée — Propriétaire / Suivre ma demande

Le 2 septembre 2026, la session Propriétaire a ouvert avec succès la route réelle `/bookings/b2e7d2a2-58e4-468e-8407-a0ef3e9c7b64` après l’action « Suivre ma demande ». La page affiche le titre « Détails de la réservation », le statut « Confirmée », la date du mercredi 9 septembre 2026 à 10:00 pour 60 minutes, le chien `QA_TEMP_Nova`, l’Accompagnateur Hamid, une section « Preuves de la promenade » vide, un code unique masqué avec les actions « Afficher le code » et « Copier le code », ainsi que « Signaler un incident ». La navigation desktop et les deux colonnes d’informations sont visibles sans débordement dans la capture fournie et dans la session consultée. Le code n’a pas été révélé ni copié afin de préserver le secret de validation. Le clic de l’action « Signaler un incident » n’a pas été déclenché, car il s’agit d’une mutation/déclaration nécessitant une intention explicite.

## Correctif sécurité dépendances — vague 021

La CI du 1er septembre 2026 a révélé deux alertes hautes sur `browserslist@4.26.3`, transitive via Babel/TanStack. Le champ `pnpm.overrides` du manifeste étant ignoré par pnpm 11, l’override a été placé dans `pnpm-workspace.yaml` avec `browserslist: 4.28.8`. Le lockfile a été régénéré, puis les contrôles locaux `typecheck`, `build` et `pnpm audit --prod --audit-level=high` sont passés. La CI GitHub du SHA `5f78a707f5c1b7fd7ec61b9c6d8333ebceb01682` est verte sur les cinq étapes. Les annotations de lint existantes et l’avertissement Node.js des actions GitHub restent non bloquants.

## QA navigateur — résultat complémentaire

L’action Propriétaire « Suivre ma demande » a été vérifiée en session réelle : la navigation ouvre la réservation `b2e7d2a2-58e4-468e-8407-a0ef3e9c7b64` sur `/bookings/:id`. La fiche affiche le statut confirmée, les informations de promenade, le chien, l’Accompagnateur, les preuves absentes, le code masqué et l’action « Signaler un incident ». Le code n’a pas été révélé/copier et aucune déclaration n’a été soumise.
