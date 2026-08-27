# DogWalking — Audit final de préparation à la mise en production

**Date :** 27 août 2026  
**Périmètre :** application publique et privée, données Supabase, sécurité, qualité du code, affichage responsive, contenus opérationnels et configuration de publication.  
**Méthode :** lecture des directives projet, inspection du code actif et des parcours montés, contrôles Supabase en lecture seule, construction de production, analyse statique et recettes visuelles aux formats mobile, tablette et bureau.

> **Décision recommandée : ne pas ouvrir le site au public à ce stade.** La version applicative est nettement plus fiable et les défauts bloquants de navigation, de rendu et de données fictives accessibles ont été traités. Néanmoins, l’ouverture publique doit attendre la levée des prérequis juridiques, opérationnels, de sécurité Supabase et de données métier détaillés ci-dessous.

## 1. État de préparation

| Domaine | État | Conclusion |
|---|---|---|
| Construction et typage | Validés | `pnpm run typecheck` et `pnpm run check` réussissent après les corrections. |
| Analyse statique | Utilisable, dette à résorber | `pnpm run lint` ne contient plus d’erreur mais relève **330 avertissements**, principalement sur les types `any`, les dépendances de hooks et les exports de composants. |
| Parcours publics | Validés visuellement | Accueil, recherche, candidature, authentification et ressources légales ont été contrôlés sans débordement visible aux largeurs ciblées. |
| Espaces privés | Protégés par le rôle | L’accès attend désormais la résolution du profil et refuse l’affichage si celui-ci est indisponible. Une recette authentifiée complémentaire reste nécessaire. |
| Données métier | Insuffisantes pour une ouverture locale | La recherche publique affiche actuellement **0 profil disponible** dans la sélection testée ; aucun faux profil n’a été injecté. |
| Paiement | Hors périmètre actif | L’interface indique qu’aucun règlement, séquestre, remboursement ni facture automatisée n’est disponible. |
| Conformité légale | Bloquant | Les coordonnées et textes de l’éditeur restent explicitement à renseigner puis faire valider. |
| Sécurité Supabase | Bloquant conditionnel | Alertes élevées encore ouvertes sur `pg_net`, exécution de fonctions `SECURITY DEFINER` et protection de mots de passe compromis. |

## 2. Correctifs appliqués durant cet audit

### Navigation, rendu et responsivité

Le serveur de prévisualisation acceptait un ancien hôte temporaire, ce qui empêchait la vérification fiable de l’application. La règle a été adaptée au domaine sécurisé de prévisualisation courant, puis le serveur a été redémarré. Les routes historiques `/dashboard-legacy` et `/walker-dashboard-legacy` ne montent plus de tableaux de bord issus de démonstrations : elles redirigent vers les espaces privés actuels, avec authentification requise.

La navigation principale bascule désormais vers le menu compact avant le seuil tablette. Cela évite d’écraser les libellés de navigation, les actions de connexion et le logo entre 768 et 1023 pixels. L’en-tête de candidature Accompagnateur a été ramené à **340 px** de haut sur petit écran ; l’icône et la typographie suivent une échelle mobile dédiée. Le formulaire apparaît donc plus rapidement sans perte de lisibilité.

| Anomalie constatée | Correction appliquée | Vérification |
|---|---|---|
| Demande de notifications superposée aux contenus de recherche et de candidature | Invitation globale retirée : aucune permission intrusive n’est sollicitée au chargement d’un parcours public. | Contrôle mobile 430 px. |
| Tableau de bord historique alimenté par des données de démonstration | Redirection permanente vers les parcours protégés actuels. | Contrôle de `/dashboard-legacy` et `/walker-dashboard-legacy`. |
| Navigation trop dense au format tablette | Navigation de bureau réservée à `lg`, menu latéral sous ce seuil. | Contrôles 1024 px et mobile. |
| Héros de candidature trop haut sur mobile | Hauteur, pictogramme et taille de texte ajustés avec des seuils responsives. | Contrôle 430 px. |
| Écran d’erreur du routeur partiellement en anglais | Libellés d’erreur et retours à l’accueil localisés en français. | Compilation validée. |

### Données, accès et comportements non trompeurs

Le chargement du profil utilisateur était asynchrone mais l’état global cessait d’être « en cours » avant la fin de cette requête. Un utilisateur déjà connecté pouvait donc voir brièvement un espace qui ne correspondait pas à son rôle avant la redirection. Le contexte d’authentification garde désormais l’état de chargement pendant la résolution du profil ; le garde d’accès redirige vers l’authentification avec un retour explicite si le profil n’est pas disponible.

Le tableau administrateur n’additionne plus seulement les rôles `owner` et `walker` pour afficher un faux total. Il utilise le nombre réel de profils retournés et expose un état d’échec avec action « Réessayer » si une requête administrative ne répond pas correctement. L’application évite ainsi d’afficher des compteurs nuls ou incomplets comme si les données étaient exactes.

Les captures d’exception vides ont été remplacées dans les zones de messagerie, de disponibilité, de formation et de notifications. Les échecs sont maintenant journalisés, et les sauvegardes locales de formation sont identifiées comme solution de repli plutôt qu’un succès silencieux.

### Contrôles qualité et continus

La configuration de lint exclut maintenant les archives importées, migrations et prototypes non routés afin que le contrôle se concentre sur le code maintenu. Les règles de formatage sont dissociées de l’analyse sémantique ; le typage TypeScript strict reste exécuté dans la CI. La chaîne GitHub comprend désormais une étape de lint additionnelle avant la construction de production.

> Les **330 avertissements** ne bloquent pas la construction, mais ils constituent une dette technique réelle. Ils concernent essentiellement les `any` historiques et des effets React dont les dépendances doivent être stabilisées avec `useCallback` ou `useMemo` selon le cas. Une résolution progressive, avec recette de chaque tableau de bord, est recommandée avant une exposition durable.

## 3. Contrôles réalisés

| Contrôle | Résultat | Limite |
|---|---|---|
| `pnpm run typecheck` | Réussi. | Ne remplace pas les tests fonctionnels en navigateur. |
| `pnpm run check` | Réussi : construction client et serveur de production générée. | L’avertissement de découpage dynamique de Vite demeure non bloquant. |
| `pnpm run lint` | **0 erreur, 330 avertissements.** | La dette de typage et de hooks reste à traiter. |
| Audit de dépendances précédent | 0 vulnérabilité critique, 0 haute, 2 modérées. | Les deux alertes React Router restent conditionnées à une migration majeure. |
| Recette desktop | Accueil, recherche, candidature, authentification, ressources légales et routes historiques rendus. | La capture isolée d’`/annonces-libres` a échoué lors d’un passage ; elle avait été contrôlée avec succès auparavant. |
| Recette 320, 430, 1024 px | Pas de débordement horizontal ou de superposition critique persistante sur les pages publiques testées. | Les tableaux de bord requièrent les comptes QA de chaque rôle. |
| Contrôle Supabase | Schéma, avis de sécurité/performance, rôles et statuts consultés sans écrire en base. | Les alertes ne doivent pas être considérées comme closes sans tests multi-rôles. |

## 4. Données manquantes et limites produit à assumer

La plateforme ne doit pas simuler son offre. Les profils visibles, disponibilités, zones et informations professionnelles doivent provenir de données validées. L’état vide « Aucun accompagnateur disponible » est préférable à une donnée d’exemple mais empêche, en pratique, le lancement commercial de la recherche tant qu’un nombre minimal de profils autorisés, services, tarifs indicatifs et zones n’est pas publié.

| Sujet | État actuel | Décision attendue avant ouverture |
|---|---|---|
| Accompagnateurs publics | Aucune fiche ne correspond à la sélection contrôlée. | Valider et publier de vrais profils, zones, services et disponibilités. |
| Annonces libres | Création disponible selon les droits ; attribution/candidature est volontairement limitée sans RPC atomique. | Soit finaliser le flux atomique, soit annoncer clairement cette limite dans le parcours commercial. |
| Paiement | Désactivé dans le produit public. | Conserver explicitement l’absence de paiement, ou intégrer un prestataire et documenter KYC, remboursement, facturation et responsabilités. |
| Notifications | Les notifications temps réel en application existent ; la permission navigateur n’est plus demandée globalement. | Concevoir un réglage explicite, contextuel et réellement relié à un service de souscription avant de relancer les notifications push. |
| Contact et support | Coordonnées de publication absentes du footer. | Publier un canal de support réellement surveillé avec délais et procédure d’escalade. |

## 5. Conditions bloquantes de publication

### Légal, RGPD et exploitation

Les ressources légales déclarent elles-mêmes que la raison sociale, l’adresse, l’immatriculation et le contact doivent être ajoutés. Ces informations, de même que les CGU, la politique de confidentialité, les règles d’annulation, de photos, de documents, de litiges, de responsabilité et d’assurance, ne peuvent pas être complétées par hypothèse. La validation d’un conseil juridique externe reste indispensable.

La politique de protection des données doit également identifier le responsable de traitement, les finalités, bases légales, sous-traitants, durées de conservation, procédure d’exercice des droits, modalités d’effacement des preuves de mission et gestion des éventuels transferts.

### Authentification, domaine et sécurité Supabase

Le domaine définitif, les URL exactes de redirection Auth, l’expéditeur e-mail et le compte administrateur QA doivent être confirmés avant la publication. L’activation de la protection contre les mots de passe compromis dans Supabase Auth est recommandée comme mesure de base ; sa disponibilité dépend de la configuration de l’organisation [1].

Le contrôle Supabase a encore signalé trois sujets à haute priorité : l’extension `pg_net` est présente dans le schéma `public`, plusieurs fonctions `SECURITY DEFINER` restent exécutables par `authenticated`, et la protection des mots de passe compromis est désactivée. Les fonctions déjà contrôlées réalisent des vérifications applicatives, mais les permissions ne doivent pas être révoquées globalement sans recette multi-rôles préalable. Les politiques RLS doivent conserver des appels d’authentification évalués une seule fois par requête lorsque nécessaire [2].

### Dette de dépendances et tests QA

Deux vulnérabilités modérées associées à `react-router` 6.30.6 sont toujours répertoriées dans l’audit de dépendances historique. La mise à jour connue passe par React Router 7.18.0 ou version ultérieure ; elle doit être traitée comme un chantier séparé avec recette complète des routes, de l’hydratation SSR et des redirections sécurisées [3].

Une recette browser de bout en bout reste à réaliser avec quatre identités distinctes et autorisées : un Propriétaire, un Accompagnateur validé, un Administrateur et un tiers sans lien. Elle doit valider les refus aussi rigoureusement que les cas nominaux : accès aux photos privées, acceptation/refus de demande, changement de statut, litige, suppression de données et déconnexion. Aucune donnée de test ne doit subsister sans validation de l’éditeur.

## 6. Séquence de lancement recommandée

| Ordre | Action | Critère de sortie |
|---|---|---|
| 1 | Renseigner et valider les documents légaux, RGPD et coordonnées de support. | Footer et pages légales ne comportent plus de champs à compléter. |
| 2 | Définir le périmètre produit public : paiement, annonces libres, notifications et zones couvertes. | Les promesses de l’interface correspondent exactement aux services opérables. |
| 3 | Publier des données métier réelles et contrôlées. | La recherche présente des profils autorisés dans les zones annoncées, sans donnée fictive. |
| 4 | Corriger les alertes Supabase avec migrations testées et comptes QA. | Avis de sécurité clos ou risque formellement accepté avec responsable désigné. |
| 5 | Configurer domaine, Auth, expéditeur e-mail, gestion des mots de passe et monitoring. | Inscription, confirmation, connexion, retour et incident sont testés sur le domaine final. |
| 6 | Résorber progressivement les avertissements ESLint et planifier la migration React Router. | Aucun avertissement critique de hooks ou de typage dans les parcours actifs. |
| 7 | Réaliser une recette multi-rôles, sauvegarde/restauration et procédure de retour arrière. | PV de recette signé, sauvegarde vérifiée, checkpoint et plan de rollback identifiés. |
| 8 | Créer un checkpoint puis utiliser le bouton **Publier** de l’interface de gestion. | Publication déclenchée par l’éditeur après validation des étapes précédentes. |

## 7. Conclusion

Les corrections de cette vague renforcent la version actuelle : les parcours publics sont plus fiables sur petits écrans, les données de démonstration ne sont plus accessibles par les anciennes routes, les statistiques administratives ne masquent plus les échecs de chargement, et l’authentification attend maintenant le profil avant de dévoiler un espace privé. La qualité de build est validée et la CI inclut le lint applicatif.

La publication reste toutefois prématurée tant que l’identité légale, les textes contractuels, les informations RGPD, les données métier réelles, les alertes de sécurité Supabase et la recette multi-rôles ne sont pas finalisées. Cette conclusion protège à la fois les utilisateurs, l’éditeur et la crédibilité opérationnelle de DogWalking.

## Références

[1] [Supabase — Password security and leaked password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)  
[2] [Supabase — Row Level Security : évaluation de fonctions avec `select`](https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select)  
[3] [GitHub Security Advisory — React Router open redirect via backslash](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6)  
[4] [Supabase — Database linter : extension dans le schéma `public`](https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public)  
[5] [Supabase — Database linter : fonctions `SECURITY DEFINER` exécutables](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable)
