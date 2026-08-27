# DogWalking — Constats visuels initiaux 009

**Date :** 27 août 2026  
**Supports observés :** bureau 1440 × 1000 et mobile 375 × 812, routes publiques principales.

## Résultat de chargement

Le domaine de prévisualisation était initialement bloqué par une valeur `allowedHosts` obsolète dans `vite.config.ts`. Après l’autorisation ciblée du suffixe `.manus.computer`, le rendu client est disponible. La capture statique peut encore afficher brièvement le composant de chargement côté client, mais l’inspection du DOM confirme que le contenu de l’accueil se monte correctement.

## Constats transversaux

| Priorité | Constat | Impact à vérifier/corriger |
|---|---|---|
| Bloquant publication | La page « Ressources légales » expose explicitement des informations « à compléter » pour l’éditeur, l’adresse, l’immatriculation, le contact et l’hébergeur. | Publication publique non autorisable tant que ces données validées ne sont pas fournies par l’éditeur et revues juridiquement. |
| Élevée | La demande d’activation des notifications est affichée au premier chargement sur toutes les captures, y compris au-dessus des formulaires et du footer. | Elle obstrue des contenus et doit être déclenchée de manière contextuelle, avec mémorisation fiable du choix utilisateur. |
| Élevée | Le parcours « Trouvez votre Accompagnateur » affiche un état vide réel, tandis que les données de la base ne comprennent que trois profils Accompagnateur et certains ne sont pas publiables. | Prévoir une stratégie de lancement par zone ou un état vide de conversion encore plus explicite ; aucune donnée fictive ne doit être substituée. |
| Moyenne | Le pied de page présente « Coordonnées de publication à confirmer ». | Ce texte ne doit pas rester en ligne en production. |
| Moyenne | Les pages publiques partagent une identité graphique cohérente sur grand écran ; la recette mobile et tablette reste à effectuer. | Tester les débordements, les cibles tactiles, les formulaires et les éléments fixes aux largeurs prescrites. |

## Recette mobile à 375 px

| Priorité | Constat | Impact à vérifier/corriger |
|---|---|---|
| Élevée | La demande d’activation des notifications masque le champ de recherche et les éléments de formulaire sur l’accueil, la recherche d’Accompagnateurs et la candidature. | Ne pas demander la permission au chargement ; présenter une invitation contextuelle, après valeur utilisateur, sans couvrir les champs critiques. |
| Moyenne | La navigation compacte est exploitable et les contenus sont empilés sans débordement horizontal visible sur les pages contrôlées. | Étendre le contrôle à 320, 390 et 430 px, ainsi qu’aux tableaux et dashboards authentifiés. |
| Moyenne | La page de candidature compresse fortement le visuel d’en-tête avant le formulaire. | Recadrer ou réduire le visuel sur mobile afin de préserver la lisibilité et de donner la priorité au formulaire. |
| Moyenne | Les cartes de l’accueil sont très longues sur mobile ; l’information reste lisible mais le tunnel est dense. | Réévaluer la longueur du contenu et les priorités de conversion lors du prochain passage UX, sans dégrader les obligations d’information. |

## Recette mobile à 320 px

| Priorité | Constat | Impact à vérifier/corriger |
|---|---|---|
| Élevée | L’invitation aux notifications recouvre le bandeau de conditions puis l’état vide des annonces. Elle couvre également les explications de candidature. | Corriger le déclenchement et la position avant toute publication ; cette superposition nuit à la compréhension des premiers écrans. |
| Moyenne | La barre principale passe correctement en menu compact et aucun défilement horizontal n’est visible sur les cinq pages contrôlées. | Conserver ce seuil de bascule dans les ajustements futurs. |
| Moyenne | Les éléments de réassurance de la candidature deviennent trop compacts et leur corps de texte est difficile à lire dans les cartes étroites. | Simplifier le texte ou réduire le nombre d’étapes visibles avant le formulaire aux petits écrans. |
| Faible | Le footer passe en colonnes sur petit écran et reste dans le viewport, mais ses liens et libellés deviennent petits et denses. | Augmenter légèrement l’interligne et les cibles tactiles lors de la passe de finition. |

## Recette tablette à 768 px

| Priorité | Constat | Impact à vérifier/corriger |
|---|---|---|
| Élevée | La navigation principale conserve tous ses libellés au format compact ; à la largeur tablette, certains liens deviennent très étroits et la zone de connexion sort visuellement du cadre. | Basculer vers un menu mobile/tablette accessible avant que la barre ne devienne dense ou tronquée. |
| Moyenne | Les formulaires de l’annonce libre et de candidature conservent des champs lisibles, sans débordement horizontal visible. | Préserver ce comportement après les futurs ajustements de menu et d’invitation aux notifications. |
| Moyenne | La page d’aide maintient une grille stable ; la colonne de catégories et la FAQ restent exploitables à cette largeur. | Confirmer ensuite les interactions clavier et l’affichage à 1024 px. |

## Recette à 1024 px

| Priorité | Constat | Impact à vérifier/corriger |
|---|---|---|
| Moyenne | À 1024 px, la navigation principale et les actions d’authentification sont entièrement visibles ; les grilles de service, de recherche et de candidature restent structurées. | Aucun débordement horizontal visuel n’a été relevé sur les pages inspectées. |
| Moyenne | Les filtres de la recherche d’Accompagnateurs disposent d’une disposition confortable à ce seuil. | Réutiliser la même qualité de césure et d’espacement pour les tableaux des espaces authentifiés. |
| Bloquant publication | Les coordonnées de publication restent absentes de toutes les déclinaisons de footer. | Fournir les informations légales validées ; ce point relève de l’éditeur, pas d’une correction d’interface. |

## Recette mobile à 430 px

| Priorité | Constat | Impact à vérifier/corriger |
|---|---|---|
| Élevée | La modale d’autorisation des notifications est affichée au-dessus de la recherche d’Accompagnateurs et de la candidature ; elle masque notamment les consignes et cartes de statut. | Corriger par une demande contextuelle post-action ou laisser l’utilisateur l’activer depuis son espace. |
| Moyenne | L’état « Aucun accompagnateur disponible » est clair, actionnable et ne se substitue pas à des profils fictifs. | Prévoir des données validées ou une stratégie de déploiement par zone avant lancement commercial. |
| Moyenne | L’annonce libre affiche un état vide lisible et le footer s’adapte sans dépassement horizontal visible. | La création et la gestion de l’annonce nécessitent une recette authentifiée séparée. |
| Moyenne | Le visuel d’en-tête de candidature conserve une taille importante ; il repousse le formulaire sur les petits écrans et le texte de surimpression est plus difficile à lire. | Réduire la hauteur sur mobile, adapter le point focal et renforcer le contraste de la surimpression. |

## Correctifs validés visuellement

| Correctif | Résultat observé |
|---|---|
| Invitation globale aux notifications retirée | Les parcours publics ne sont plus recouverts par une demande de permission au chargement. |
| Candidature Accompagnateur mobile | L’en-tête est plus court, l’icône et la typographie sont adaptés, et le formulaire remonte de façon visible dans le parcours. |
| Routes de démonstration historiques | `/dashboard-legacy` et `/walker-dashboard-legacy` redirigent désormais vers le parcours authentifié courant, qui présente l’entrée d’authentification sans données fictives. |
| Marque et rythme éditorial | Le logo est maintenant un pictogramme vectoriel cohérent, le footer utilise la même signature et l’accueil alterne un visuel humain, un panneau sable éditorial et une zone de recherche. |

La capture desktop finale confirme le chargement visuel de l’accueil, de la recherche, de la candidature, de l’authentification et des deux redirections historiques. L’obtention de la capture de `/annonces-libres` a échoué lors du passage de revue ; cette page avait toutefois été contrôlée avec succès dans les recettes desktop et mobile antérieures.

## Pages contrôlées

Les pages `/`, `/walkers`, `/annonces-libres`, `/auth`, `/walker/register`, `/support`, `/ressources-legales` et `/nous-sommes-presents` se chargent visuellement après la correction de l’hôte de prévisualisation. Aucun jugement fonctionnel sur les boutons, formulaires ou écritures de données n’est déduit de cette observation visuelle seule.
