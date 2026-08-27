# DogWalking — Rapport de finalisation 011

**Date :** 27 août 2026  
**Périmètre :** clôture de recette, authentification, contrôles de construction, recommandations Supabase, exploitation et mise en production.

> **Conclusion de livraison.** Le code livré est utilisable en environnement contrôlé et les parcours de demande, candidature, sélection et preuve sont désormais fondés sur des opérations réelles plutôt que sur des promesses de paiement, disponibilité ou certification. Il ne doit toutefois **pas être ouvert au public** avant la levée des prérequis d’identité légale, RGPD, domaine/Auth, exploitation et règles métier listés dans ce rapport.

## 1. Correctif final : retours d’authentification et récupération du mot de passe

La vague 011 corrige deux ruptures de parcours qui restaient possibles lors d’une confirmation par e-mail ou d’une récupération de compte. Le callback conserve désormais un éventuel retour **interne** validé, par exemple vers `/walker/dashboard`, sans jamais accepter un domaine tiers. Une valeur telle que `https://evil.example` est rejetée et l’utilisateur reste sur DogWalking.

Le lien de récupération de mot de passe débouche maintenant sur un formulaire qui demande un nouveau mot de passe et sa confirmation. Le mot de passe est contrôlé côté interface (au moins huit caractères, une lettre et un chiffre), puis envoyé à Supabase uniquement après réception d’un lien de récupération valide. Le callback de récupération ne redirige donc plus immédiatement vers un tableau de bord.

| Contrôle ciblé | Résultat de la recette | État |
|---|---|---|
| Retour visiteur `/dashboard` | Redirection vers `/auth?redirect=%2Fdashboard`. | Conforme. |
| Retour visiteur `/walker/dashboard` | Redirection vers `/auth?redirect=%2Fwalker%2Fdashboard`. | Conforme. |
| Retour externe forgé | `/auth?redirect=https%3A%2F%2Fevil.example` reste sur l’écran DogWalking. | Conforme. |
| Écran de récupération | Les deux champs et l’action de mise à jour s’affichent sans soumission de données en visiteur. | Conforme visuellement. |
| Lien réel de récupération et e-mail | Nécessite une boîte e-mail QA et la configuration Auth de production. | À valider avant ouverture publique. |

La trace détaillée est conservée dans [`recette-navigation-011.md`](./recette-navigation-011.md). Le lint ciblé sur `Auth.tsx` et `AuthCallback.tsx` termine sans sortie ni erreur.

## 2. Contrôles techniques de la livraison

Les contrôles de compilation ont été rejoués après les dernières modifications. L’audit de dépendances de production ne retourne aucune vulnérabilité connue. La construction SSR aboutit ; un avertissement Nitro relatif à `inlineDynamicImports` reste non bloquant, car l’artefact de production est généré.

| Contrôle | Résultat | Lecture de release |
|---|---|---|
| `git diff --check` | Réussi. | Aucun défaut d’espacement de patch détecté. |
| `pnpm run typecheck` | Réussi. | Types TypeScript valides. |
| `pnpm run build` | Réussi. | Build client et SSR généré. |
| `pnpm audit --prod --audit-level=high` | `No known vulnerabilities found`. | Aucune vulnérabilité connue dans le périmètre audité. |
| Lint ciblé des fichiers 011 | Réussi sans sortie. | Le correctif d’authentification n’a pas introduit de nouvelle erreur ou avertissement local. |
| Lint global | Non finalisé localement après deux fenêtres d’attente ; le journal a commencé à remonter les avertissements historiques connus. | **Non bloquant pour ce patch**, mais dette à traiter séparément ; ne pas le présenter comme propre. |
| CI GitHub du dernier commit 010 | Terminée avec succès le 27 août 2026 : [run 33032005052][4]. | Contrôle de référence historique réussi avant le patch 011. |
| CI GitHub de la vague 011 | Terminée avec succès le 27 août 2026 : [run 33032632150][5]. | Contrôle obligatoire vert pour le SHA `043be83ba25d202627d0a7d02a9358d72b21ca2b`. |

Le dépôt conserve des avertissements ESLint historiques, notamment des `any` explicites et des dépendances de hooks incomplètes dans des composants anciens ou non routés. Ils ne sont ni effacés ni maquillés par ce rapport. Leur correction doit être effectuée par lots fonctionnels, avec recette de chaque écran concerné, et non par désactivation des règles.

## 3. État Supabase contrôlé en clôture

Le projet Supabase **Front et backend dogwalking** (`aqitjhaotpautjywoeys`) est revenu actif et sain au moment du contrôle. La liste des migrations contient les migrations de flux atomiques de candidature et de sélection d’annonce ouverte, ainsi que le durcissement Storage appliqué en dernière position. Aucun changement DDL n’a été exécuté dans la vague 011.

| Domaine | Constat final | Décision de la vague 011 |
|---|---|---|
| Conseiller de sécurité | Une alerte `WARN` : protection des mots de passe compromis désactivée. | Laisser le réglage ouvert : il dépend du compte et de l’activation dans Supabase Auth. [1] |
| Conseiller de performance | 15 informations et 57 avertissements, dont index jamais utilisés et groupes de politiques RLS permissives. | Ne supprimer ni index ni politique sans mesure post-lancement et recette de droits par rôle. [2] [3] |
| Candidatures et sélection | Fonctions atomiques appliquées ; scénarios QA précédents exécutés sous transaction puis annulés. | Aucun jeu de données fictif n’est conservé par cette recette. |
| Stockage privé | `walk-proofs` et `walker-documents` sont privés et limités aux utilisateurs authentifiés autorisés. | Conserver ce modèle. |
| Photos de chien et avatars | Compartiments encore publics en lecture. | Décision RGPD/produit indispensable avant publication de données personnelles. |

> Les avertissements de politiques permissives sont d’abord des signaux de coût de requête : les politiques `PERMISSIVE` applicables sont combinées avec `OR`. Les fusionner sans matrice d’autorisations de régression peut élargir ou réduire des accès légitimes. [3]

La protection contre les mots de passe compromis doit être activée dans Supabase Auth si le plan et les choix de confidentialité de l’éditeur le permettent. Supabase indique que ce réglage vérifie les mots de passe exposés via Have I Been Pwned et qu’il augmente la protection des comptes. [1]

## 4. Exploitation : conditions de mise en service

Le travail technique ne substitue pas les décisions de l’éditeur. Avant de communiquer une URL publique, l’exploitant doit faire renseigner les informations réelles, configurer les services à partir de ces données et signer les documents appropriés. Aucun nom d’entreprise, SIREN, assurance, support, disponibilité, délai, tarif, commission ou garantie n’a été inventé dans l’application.

| Priorité | Blocage à lever par l’éditeur | Preuve attendue avant ouverture |
|---|---|---|
| Critique | Mentions légales, identité de l’éditeur, adresse, contact et responsabilité. | Informations éditoriales réelles, relues et intégrées aux pages. |
| Critique | CGU, confidentialité, base légale, registre, droits des personnes et durée de conservation. | Validation juridique/RGPD documentée ; procédure d’exercice des droits opérationnelle. |
| Critique | Domaine final, URL de redirection Supabase, expéditeur e-mail, modèles e-mail et accès Administrateur. | Test réel d’inscription, confirmation, récupération et connexion Admin sur le domaine final. |
| Critique | Sauvegardes, supervision, gestion d’incident et contact support. | Procédure écrite, responsabilités nommées, test de restauration et canal de support réel. |
| Critique | Protection des mots de passe compromis. | Réglage Auth activé, ou décision documentée de ne pas l’activer avec mesure compensatoire. |
| Haute | Photos d’animaux et avatars actuellement publics. | Décision écrite public/privé, information des personnes et migration si le choix est privé. |
| Haute | Vérification documentaire des Accompagnateurs. | Liste de pièces, critères, conservation, rejet/recours, responsables de contrôle. |
| Haute | Disponibilités, conflits et contre-propositions. | Modèle de données persistant, règles de réservation et recette avant toute promesse d’affichage. |
| Haute | Annulation, preuve, incident et litige. | Règles métier et responsabilité opérationnelle approuvées ; aucune promesse non vérifiée. |

## 5. Procédure de release et retour arrière

La branche `main` est protégée : la CI est exigée, une revue est requise, l’historique linéaire et la résolution des conversations sont imposés ; la suppression et le push forcé sont interdits. La livraison 011 est disponible sur la branche `release/finalisation-011` au SHA `043be83ba25d202627d0a7d02a9358d72b21ca2b`, dans la [pull request n°10][6]. Sa CI est verte, mais GitHub signale correctement que la fusion demeure **bloquée par la revue obligatoire**. Pour toute évolution suivante, la procédure normale est **branche courte → pull request → CI verte → revue → fusion linéaire**. Le bypass administrateur doit rester une exception consignée en cas de récupération urgente.

Avant activation publique, l’exploitant doit créer un checkpoint et conserver l’archive de sources de la vague. En cas d’incident applicatif, le premier retour arrière est le checkpoint précédent validé, puis la vérification CI et la recette minimale des écrans publics, Auth et barrières de tableau de bord. Les changements de schéma et de données doivent être restaurés selon une procédure spécifique : un retour arrière de code ne restaure pas automatiquement les données de base.

## 6. Décision de clôture

| Statut | Décision |
|---|---|
| Code et build | Checkpoint `043be83b`, branche GitHub et CI de la pull request n°10 vérifiés. |
| Environnement contrôlé | Les parcours publics, les protections de navigation et l’écran de récupération peuvent être démontrés. |
| Ouverture publique | **Bloquée** jusqu’à la levée documentée des prérequis critiques de la section 4. |
| Paiement et garanties | Non intégrés et non présentés comme actifs. |
| Données QA | Réservées aux comptes autorisés et aux scénarios réversibles `QA_TEMP_`. |

## Références

[1] [Supabase — Sécurité des mots de passe et protection contre les mots de passe compromis](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)  
[2] [Supabase — Database Linter : index non utilisés](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index)  
[3] [Supabase — Database Linter : politiques RLS permissives multiples](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies)  
[4] [GitHub Actions — CI DogWalking, run 33032005052](https://github.com/dogwalkingnew/supabase-polish/actions/runs/33032005052)
[5] [GitHub Actions — CI DogWalking, run 33032632150](https://github.com/dogwalkingnew/supabase-polish/actions/runs/33032632150)
[6] [GitHub — Pull request n°10 : Finalisation 011](https://github.com/dogwalkingnew/supabase-polish/pull/10)
