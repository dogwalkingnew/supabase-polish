# DogWalking — Rapport de préparation à la mise en production 008

**Date :** 27 août 2026  
**Périmètre :** parcours Propriétaire, Accompagnateur et Administrateur ; Supabase Auth, base de données, stockage, dépendances, CI et contenus publics.

> **Décision de diffusion : non autorisée pour une ouverture publique immédiate.** Le code et les flux techniques décrits ci-dessous ont été durcis et contrôlés, mais l’identité légale de l’éditeur, les règles métier officielles, le domaine final, les paramètres Auth et la validation juridique restent indispensables avant publication.

## 1. État de la vague

Cette vague élimine les écritures séquentielles risquées dans les parcours sensibles, retire des promesses publiques non prises en charge par l’application et installe un socle de contrôle automatisé. Les tests de base ont été exécutés avec les comptes QA autorisés et des données `QA_TEMP_` intégralement annulées en fin de transaction.

| Domaine | État vérifié | Résultat |
|---|---|---|
| Candidature Accompagnateur | Soumission et revue atomiques | Une seule candidature active est conservée ; la revue crée ou met à jour le profil activé et notifie l’intéressé. |
| Demande directe | Décision atomique | Un Accompagnateur validé, et seulement lui, peut accepter ou refuser une demande qui lui est attribuée. Le Propriétaire est notifié. |
| Démarrage de mission | Preuve + transition atomiques | La photo de prise en charge est stockée dans le compartiment privé puis la mission passe à `in_progress` dans une même opération serveur. |
| Preuves privées | Lecture signée contrôlée | L’Accompagnateur et le Propriétaire lié à la réservation peuvent lire l’objet ; une identité tierce est refusée. |
| Annonces ouvertes | Attribution masquée | Le secours client non atomique a été retiré. La sélection d’une candidature ouverte n’est pas affichée comme active tant qu’un RPC dédié n’existe pas. |
| Authentification | Retours et confirmation | Les retours sont limités aux chemins internes ; l’inscription sans session attend la confirmation d’e-mail ; les connexions sociales restent masquées par défaut. |
| Contenu public | Paiement, chiffres, certification | Les promesses de paiement, séquestre, remboursement, statistiques, revenus et certification non démontrés ont été retirées des composants de l’accueil concernés. |

## 2. Migrations Supabase appliquées

Les migrations suivantes sont versionnées dans `supabase/migrations/` et déjà appliquées au projet Supabase de travail.

| Migration | Objet | Contrôle effectué |
|---|---|---|
| `20260827000100` à `00120` | Candidatures Accompagnateur atomiques et fonctions privilégiées privées | Soumission, idempotence, refus non-admin, motif de refus obligatoire, approbation et notification testés en transaction annulée. |
| `20260827000130` | Preuves de mission privées et démarrage atomique | Accompagnateur assigné autorisé ; tiers refusé ; état de réservation et notification vérifiés sans conserver de données QA. |
| `20260827000140` et `00150` | Réponse directe Accompagnateur | Confirmation, refus, notification et refus d’un Propriétaire non assigné testés en transaction annulée. |
| `20260827000160` | Optimisation des politiques `walker_applications` | Les appels `auth.email()` sont évalués une fois par requête, sans modification de la logique d’accès. |
| `20260827000170` | Lecture Propriétaire de preuve privée liée | Propriétaire autorisé, Accompagnateur autorisé et identité tierce refusée dans un test transactionnel annulé. |

## 3. Sécurité, dépendances et intégration continue

Le client Supabase n’embarque plus ses valeurs de production comme repli. Il accepte seulement un repli explicite en développement ; hors développement, les variables de configuration sont obligatoires. Le fichier `.gitignore` exclut désormais `.env` et `.env.*`, et le guide [`docs/ENVIRONNEMENT_PRODUCTION.md`](../docs/ENVIRONNEMENT_PRODUCTION.md) décrit les variables requises sans divulguer de secret.

Une CI GitHub est fournie dans `.github/workflows/ci.yml`. Elle installe le verrouillage, lance le contrôle TypeScript, construit l’application et échoue en présence de vulnérabilités de niveau haut ou critique. Dependabot est également configuré pour les dépendances npm et les actions GitHub.

| Vérification | Résultat |
|---|---|
| `pnpm run typecheck` | Réussi. |
| `pnpm run build` | Réussi. |
| `git diff --check` | Réussi avant archivage. |
| `pnpm audit --prod` | **0 critique, 0 haute, 2 modérées**. |
| Audit CI (`audit-level=high`) | Réussi ; les deux alertes modérées restent visibles dans le rapport d’audit. |

Les deux alertes modérées restantes concernent `react-router` 6.30.6. Le correctif connu est une migration vers la branche majeure 7.18.0 ou supérieure ; elle n’a pas été forcée car elle exige une recette complète des routes, de l’hydratation SSR et des redirections. Les redirections applicatives créées dans cette vague sont néanmoins restreintes aux chemins internes. La migration du routeur demeure une **condition technique avant une exposition publique durable**. [4]

L’analyse sécurité Supabase ne remonte plus qu’un avertissement : la protection contre les mots de passe compromis est désactivée. Cette option se règle dans Supabase Auth et ne peut pas être déclarée active sans accès au réglage et au plan compatible de l’organisation. [1]

Les avertissements de performance RLS spécifiques aux candidatures ont été résolus en appliquant la recommandation officielle `(select auth.<fonction>())`. Les indices signalés comme non utilisés ont été conservés : leur suppression sans période d’observation pourrait dégrader des flux rares, notamment litiges, incidents, évaluations ou migrations de données. [2] [3]

## 4. Parcours désormais opérationnels

Le tableau suivant décrit les parcours disponibles dans cette version. Il ne vaut ni politique commerciale, ni engagement de service, ni condition contractuelle.

| Parcours | Règle de contrôle | Limite explicitement conservée |
|---|---|---|
| Visiteur → candidature Accompagnateur | Le brouillon est conservé localement, l’inscription est ouverte sur le bon rôle, le retour est interne et le dossier est prérempli après authentification. | L’utilisateur doit confirmer son e-mail lorsque Supabase ne retourne pas de session. |
| Candidature → activation | La revue administrative atomique produit une décision et une notification. | Les critères documentaires, les durées de revue et les pièces exigées doivent être définis officiellement. |
| Propriétaire → demande directe | La demande est attribuée à un Accompagnateur identifié. | Les disponibilités ne sont pas un calendrier opposable ; elles restent à confirmer. |
| Accompagnateur → décision | Seul un profil Accompagnateur validé et attribué peut accepter ou refuser une demande en attente. | Pas de contre-proposition versionnée ni de prévention des doubles créneaux à ce stade. |
| Mission → preuve privée | Démarrage avec photo privée ; consultation par URL signée limitée aux participants autorisés. | Les règles de durée de conservation, de contrôle et de suppression des preuves restent à adopter. |
| Annonce libre | Création de l’annonce avec animal réel et montant indicatif. | La candidature puis la sélection d’un Accompagnateur depuis une annonce ouverte sont volontairement désactivées jusqu’à l’ajout d’un RPC atomique. |

## 5. Données et décisions indispensables avant publication

Les éléments suivants ne doivent pas être inventés dans les documents ou le code. Ils constituent des prérequis bloquants pour la publication publique.

| Précondition | Information ou action attendue | Responsable à désigner |
|---|---|---|
| Identité légale | Raison sociale, forme juridique, siège, SIREN/SIRET, directeur de publication, moyens de contact publiables. | Éditeur. |
| RGPD | Responsable de traitement, DPO ou contact, finalités, bases légales, sous-traitants, durées, droits, transferts et procédure d’exercice des droits. | Éditeur et conseil juridique. |
| Textes contractuels | Mentions, CGU, confidentialité, règles d’annulation, litige, responsabilité, assurance, photos, documents et modération. | Conseil juridique externe. |
| Paiement | Confirmer officiellement « aucun paiement géré dans DogWalking » ou définir le prestataire, KYC, remboursement, facturation et responsabilité avant tout rétablissement de paiement. | Éditeur et conseil juridique. |
| Auth et domaine | Domaine final, liste exacte des URL de redirection Supabase, expéditeur e-mail, confirmation de l’Administrateur QA et protection des mots de passe compromis. | Éditeur / administrateur Supabase. |
| Stockage | Décider si les photos d’animaux peuvent rester publiques, puis écrire la base légale, la durée de conservation, les règles d’effacement et les droits d’accès. | Éditeur et référent RGPD. |
| Exploitation | Procédure de support réelle, alertes, sauvegardes testées, journalisation, gestion d’incident, propriétaire métier des litiges. | Éditeur / exploitation. |
| GitHub | Exiger CI, revue et interdire les push forcés sur `main` hors procédure d’urgence documentée. | Propriétaire du dépôt. |

## 6. Checklist de lancement et retour arrière

Avant toute publication, l’éditeur doit renseigner les secrets dans son environnement de déploiement, vérifier le domaine et les URL de redirection autorisées, exécuter `pnpm run check`, exécuter l’audit de production, relire les contenus légaux avec un conseil externe, puis réaliser une recette de bout en bout avec des comptes de test séparés. Il doit également valider les parcours de refus, annulation, preuve, suppression de données et incident, qui sont souvent absents des démonstrations nominales.

Le retour arrière applicatif doit s’effectuer par restauration du dernier commit GitHub validé ou du dernier checkpoint de projet. Les migrations de base déjà appliquées sont **append-only** : elles ne doivent pas être supprimées ni réordonnées. Toute correction de données ou de schéma doit passer par une nouvelle migration testée, précédée d’une sauvegarde vérifiée. Les données `QA_TEMP_` conservées antérieurement doivent être inventoriées et supprimées uniquement après accord explicite de l’éditeur.

## 7. Conclusion

Cette version rend les flux actifs plus cohérents, testables et prudents : les opérations sensibles sont atomiques, les preuves de mission sont privées, les promesses publiques sont alignées sur les capacités réelles et l’intégration continue couvre les contrôles essentiels. Elle ne doit toutefois pas être présentée comme prête à une ouverture publique tant que les préconditions légales, Auth, RGPD, opérationnelles et la migration sécurisée de React Router n’ont pas été levées.

## Références

[1] [Supabase — Password security and leaked password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)  
[2] [Supabase — RLS policies and `select auth.uid()` performance pattern](https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select)  
[3] [Supabase — Database linter: unused index](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index)  
[4] [GitHub Security Advisory — React Router open redirect via backslash](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6)
