# Audit global des couleurs — vague 024

## Direction retenue

Le vert de l’accueil reste la couleur primaire DogWalking et le point d’ancrage de la marque. Les couleurs secondaires servent uniquement la hiérarchie : bleu océan pour l’information et les liens secondaires, sable chaud pour les surfaces, jaune pour l’attention, rouge pour les erreurs ou annulations, et vert de succès pour les états validés.

## Corrections appliquées

Les tokens globaux de `src/styles.css` ont été vérifiés et complétés. Les surfaces `dashboard-glass` utilisent désormais un dégradé très léger entre le fond et le sable chaud, afin d’éviter les cartes entièrement blanches. Des variantes centralisées `dashboard-card-primary`, `dashboard-card-info`, `dashboard-card-warning`, `dashboard-card-danger` et `dashboard-card-success` sont disponibles pour les états de cartes sans couleurs isolées.

Les écrans Propriétaire ont été harmonisés : accueil, profil, sécurité, recherche d’Accompagnateur et historique utilisent le vert primaire, les bordures sémantiques, les icônes teintées, les badges lisibles et les fonds chauds. Les fonctions d’édition, changement de mot de passe, déconnexion, recherche et suivi n’ont pas été déplacées.

Le tableau Accompagnateur conserve ses actions métier et ses permissions. Ses cartes de validation, métriques et réservations utilisent les surfaces et tokens communs ; les actions « Voir la mission », « Accepter » et « Refuser » restent aux mêmes emplacements.

Les pages publiques `/`, `/walkers` et `/auth` ont été contrôlées en desktop 1440×900 et mobile 390×844. Leur palette principale, les CTA, les pictogrammes, les champs et les cartes sont visibles et cohérents. Les routes protégées `/dashboard`, `/walker/dashboard` et `/admin` redirigent vers l’authentification dans la capture anonyme ; leur contenu interne doit continuer à être contrôlé avec les sessions QA correspondantes.

## Validation technique

Le typecheck et le build passent après la correction CSS. La prévisualisation Vite reste active. Les avertissements lint historiques sont sans erreur bloquante. Une erreur historique `@tanstack/react-start/server-entry` reste présente dans d’anciens journaux mais ne bloque pas le build courant ; elle doit être ignorée tant qu’elle n’est pas reproduite dans le serveur actif.

## QA restant

Il faut encore ouvrir les tableaux avec des sessions réelles Propriétaire, Accompagnateur et Admin pour contrôler les couleurs internes de chaque onglet, puis vérifier les mutations « Suivre », « GO », accepter/refuser, modification de profil/animal, validation Admin et les règles RLS entre rôles. Le redéploiement Lovable reste à confirmer séparément.
