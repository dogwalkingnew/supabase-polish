# DogWalking — Rapport de corrections 004

**Date :** 26 août 2026  
**Périmètre :** pages de services, SEO partagé, navigation et ressources légales.

## Corrections appliquées

| Référence | Correction | Vérification |
|---|---|---|
| C-017 | Les pages publiques **Promenade**, **Garde à domicile** et **Marche régulière** ne présentent plus d’avis, témoignages, cas clients, études de cas, sélection, statistiques, résultats comportementaux, forfaits, protection, paiement ou preuves de mission non activés. | Contrôle navigateur de `/services/promenade` et captures mobile des deux autres services. |
| C-018 | Le gabarit générique des services ne publie plus de prix dans le balisage SEO, de badges « service vérifié », de note moyenne, de nombre d’accompagnateurs ni d’étapes financières fictives. | TypeScript validé ; gabarit corrigé pour les routes dynamiques. |
| C-019 | Le composant SEO partagé n’ajoute plus **Dogfinance**, ni le domaine externe historique ; son nom, ses métadonnées et son JSON-LD pointent vers DogWalking et un discours factuel. | Titre navigateur contrôlé : « Promenade de chien | DogWalking ». |
| C-020 | Les collections FAQ partagées ne mentionnent plus Stripe, séquestre, commission, remboursement, revenus ou vérifications qui ne sont pas disponibles. | Contrôle TypeScript global. |
| C-021 | Les menus desktop, mobile et footer utilisent désormais « Services & modalités » ; le parrainage n’est plus présenté comme actif. | Lecture et contrôle de la navigation publique. |
| C-022 | Les ressources légales sont clairement identifiées comme un **projet à compléter et faire valider** ; elles retirent les informations d’éditeur fictives et les descriptions incompatibles avec l’état actuel de l’application. | Contrôle navigateur de `/ressources-legales`. |

## Vérifications réalisées

| Contrôle | Résultat |
|---|---|
| TypeScript | `pnpm exec tsc --noEmit --pretty false` : réussi après chaque groupe de corrections. |
| Build de production | `pnpm run build` : réussi. |
| Responsive mobile | Captures complètes à 375 × 812 px de la garde à domicile et de la marche régulière : pas de débordement horizontal visible ; CTA accessibles. |
| Parcours public | Promenade, Tarifs, Support, Annonces libres et Ressources légales contrôlés dans le navigateur. |

## Limites restantes avant publication réelle

| Priorité | Point | Condition de clôture |
|---|---|---|
| P0 | Tests authentifiés des parcours Propriétaire, Accompagnateur et Admin | Utiliser des comptes QA valides ou une recette Supabase dédiée ; le domaine QA neutre a été refusé par Auth. |
| P0 | Paiements | L’intégration Stripe n’est pas configurée ; aucun paiement ne doit être annoncé ou activé sans un flux serveur sécurisé, des tests et des conditions validées. |
| P0 | Documents légaux | Ajouter les données réelles d’éditeur, d’hébergement final et de responsable de traitement, puis faire valider les documents avant publication. |
| P1 | Modules de dashboard historiques | Les composants de portefeuille, commissions, litiges, revenus et Stripe restent à auditer avec des comptes QA avant activation ou mise à disposition. |
| P1 | Données réelles | Ajouter des profils, animaux et demandes de démonstration uniquement dans une recette isolée, puis vérifier les politiques RLS avec chaque rôle. |
| P2 | Ressources de production | Déplacer les médias locaux vers un stockage durable et contrôler les URLs de production avant publication. |
