# Contrôle navigateur initial — DogWalking

**Date :** 26 août 2026  
**Environnement :** prévisualisation temporaire connectée au projet Supabase DogWalking.

## Résultats observés

| Contrôle | Résultat | Décision |
|---|---|---|
| Domaine temporaire de prévisualisation | Vite refusait initialement l’hôte exposé. | Corrigé en autorisant explicitement le domaine temporaire dans la configuration de développement. |
| Montage applicatif | L’application affichait une page d’erreur lorsque la configuration Supabase n’était pas disponible dans l’environnement. | Corrigé par un repli sur les paramètres **publics** du projet Supabase connecté, les variables d’environnement restant prioritaires. |
| Accueil public | L’accueil s’affiche avec les menus, CTA, formulaire de recherche, FAQ et footer. | Fonctionnel au chargement public. |
| Menu « Nos Services » | L’ouverture du menu et ses six entrées ont été vérifiées dans le navigateur. | Fonctionnel à l’ouverture ; navigation détaillée à poursuivre route par route. |
| Données commerciales affichées | Le héros contenait des statistiques, avis et garanties de paiement non étayés par l’état actuel des données et des intégrations. | Correction engagée : suppression des promesses non vérifiées tout en préservant le design. |

## Limites du contrôle

Les parcours protégés demandent des comptes QA distincts (propriétaire, accompagnateur et administrateur). Ils seront testés séparément avec des données explicitement préfixées `QA_TEMP_`, sans modifier les données métier existantes.

## Contrôle post-correction de l’accueil

Le héros conserve son image, ses deux CTA et sa hiérarchie visuelle après retrait des statistiques et garanties financières non étayées. Les entrées de menu, le formulaire de recherche, les cartes de services et la FAQ restent rendus. Le contrôle a cependant confirmé deux sujets encore ouverts : certains blocs secondaires conservent des promesses de paiement et de garantie, et le bloc « expertise » affiche une identité, un parcours et un lien LinkedIn non vérifiés. Ces contenus doivent être retirés ou remplacés avant toute mise en production.

## Test réel d’inscription QA — propriétaire

Le parcours `/auth` a été ouvert, le profil **Propriétaire** sélectionné et le formulaire d’inscription soumis avec un identifiant clairement préfixé `qa_temp_`. Le contrôle a confirmé que la validation frontale s’exécute et que le serveur Auth retourne un message utilisable lorsque l’adresse de test ne possède pas un domaine accepté : `Email address "qa_temp_owner_20260826@dogwalking.example" is invalid`.

Aucun utilisateur Auth ni profil applicatif correspondant n’a été créé, ce qui a été vérifié par deux requêtes en lecture seule avec `LIMIT 5`. Pour poursuivre l’intégration multi-rôles sans solliciter ou polluer une adresse réelle, il faut une boîte QA valide et contrôlable, ou un environnement Supabase de recette avec une configuration Auth dédiée.

## Constats de code — annonces libres

La recherche a identifié que `/walkers` monte une section affichant quatre annonces codées en dur avec des propriétaires, prix et statuts fictifs. Le formulaire associé est importé mais n’est pas rendu dans la section ; son mécanisme de soumission n’est donc pas atteignable. La route dédiée `/annonces-libres` contient un flux distinct fondé sur la table `bookings`. La première section doit être remplacée par une lecture de données réelles ou un état vide honnête, sans afficher de fausses annonces.

## Contrôle des parcours de recherche et d’annonces

Après correction, `/walkers` ne présente plus les quatre annonces inventées et dirige vers `/annonces-libres`. Le contrôle de la page dédiée a révélé deux défauts réels : l’interface annonçait à tort un paiement Stripe, des commissions et des reversements actifs, et le formulaire tentait d’insérer une réservation sans `dog_id` alors que ce champ est obligatoire dans Supabase. La correction rattache désormais l’annonce au premier animal du Propriétaire, redirige vers l’espace animaux lorsque nécessaire et aligne les services proposés avec les quatre valeurs autorisées dans la base (`promenade`, `garde`, `visite`, `veterinaire`).

Le contrôle navigateur post-correction confirme que le message de paiement est remplacé par une information explicite sur l’absence de traitement de paiement, puis que les squelettes de chargement sont remplacés par l’état vide réel « Aucune annonce active pour le moment. » sans erreur ni boucle de chargement.

## Contrôle responsive mobile — 375 × 812 px

Les captures complètes de `/`, `/walkers` et `/annonces-libres` ne montrent pas de débordement horizontal. Les CTA essentiels restent accessibles, les cartes se replient en une colonne et le footer se recompose proprement. Deux libellés de confiance statiques restent à nettoyer dans la recherche mobile (« Sélection vérifiée » et « Accompagnateurs Certifiés ») ; ils n’empêchent pas la navigation mais ne sont pas étayés par un calcul ou une vérification visible.

Ces libellés, la carte simulée, les disponibilités, délais de réponse, favoris, prix par défaut et modal de paiement simulés ont été retirés. Le contrôle navigateur final de `/walkers` confirme un formulaire sans paiement, une liste alimentée par l’état Supabase réel et un état vide explicite lorsqu’aucun profil ne peut être affiché.

## Contrôle de la page Tarifs

La page `/tarifs` a été remplacée par une version factuelle. Elle précise l’absence de paiement en ligne, commissions, crédits, remboursements automatisés et parrainage, tout en conservant la présentation des services et les CTA. Le premier rendu capturé affiche brièvement le chargeur global, puis une seconde lecture confirme que la page, ses cartes et sa FAQ deviennent utilisables sans boucle de chargement.

## Contrôle de la page Support

La page `/support` affiche désormais des FAQ conformes aux fonctionnalités actuelles. L’onglet Contact a été testé : il ne simule plus un envoi de formulaire et fournit uniquement le lien `mailto:` vers l’adresse de contact configurée, avec un rappel de ne pas partager de données sensibles. Les tabs FAQ, À propos et Contact restent navigables.

## Contrôle du service Promenade et SEO global

La route `/services/promenade` utilisait un gabarit distinct contenant des avis, études de cas, statistiques, paiement, protection et preuves de mission non activés. Elle est désormais remplacée par un parcours factuel centré sur la préparation de la demande. Le titre d’onglet a aussi été corrigé de « Dogfinance » vers « DogWalking » au niveau des métadonnées partagées. Le contrôle navigateur confirme le nouveau titre et l’absence de ces affirmations dans le contenu rendu.

## Contrôle responsive des services spécifiques

Les pages `/services/garde-domicile` et `/services/marche-reguliere` ont été alignées sur le même principe : aucune promesse de présence continue, sélection, forfait, résultat comportemental, paiement, avis ou preuve non implémentée. Les captures complètes à 375 × 812 px confirment une lecture en colonne, des CTA accessibles et l’absence de débordement horizontal visible sur ces deux parcours.

## Contrôle visuel global post-correction

Le contrôle des routes `/`, `/walkers` et `/annonces-libres` après harmonisation confirme que les actions et sélections publiques utilisent le vert forêt DogWalking. Les filtres autrefois bleus, l’état vide des résultats, les annonces et le footer utilisent désormais les surfaces chaudes et la hiérarchie commune. L’accueil présente également les cas d’usage factuels et le motif discret d’itinéraire de promenade sans dégrader la lisibilité.
