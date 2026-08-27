# DogWalking — Incident de chargement Lovable/mobile 012

**Signalement :** les pages autres que l’accueil affichent une erreur de chargement depuis un navigateur mobile sur un domaine Lovable.

| Vérification | Constat | Conséquence |
|---|---|---|
| URL visible dans la capture : `https://kle-polish.lovable.app` | Elle retourne actuellement « Project not found ». | Cette URL seule ne permet pas de reproduire la page exacte affichée par l’utilisateur. |
| Aperçu DogWalking restauré : `/walkers` | La route affiche d’abord le chargeur, puis se rend complètement. | Le chargement initial doit être réduit ; il n’est pas une preuve d’échec permanent dans cet aperçu. |
| Réponses HTTP de `/`, `/walkers`, `/auth`, `/annonces-libres`, `/support`, `/ressources-legales` | Code `200` dans l’aperçu restauré. | Aucun 500 SSR n’est reproduit sur ce serveur de travail. |
| Architecture de build | Application React avec `BrowserRouter`, configuration TanStack Start et ancien wrapper SSR de secours. | La compatibilité d’hébergement doit être testée sur un build SPA avec repli explicite de routes. |
| Recette mobile après activation du mode SPA | `/`, `/auth` et `/annonces-libres` rendent leur contenu ; `/walkers`, `/support`, `/ressources-legales` et les routes protégées sont capturées sur le chargeur de la suspension globale. | Le repli de route est préparé, mais le chargeur global doit être remplacé par un rendu immédiat des routes publiques et un délai d’échec explicite pour les imports bloqués. |
| Rechargements directs sur artefact SPA de production | `/walkers` et `/support` servent tous deux le shell SPA, chargent les assets versionnés et rendent leurs contenus complets dans un navigateur réel. | Conforme : le défaut de réécriture de route est traité dans l’artefact produit. |
| Rechargement direct d’un espace protégé | `/dashboard` redirige vers `/auth?redirect=%2Fdashboard` depuis le shell SPA, au lieu d’afficher une erreur d’hébergement. | Conforme : la barrière d’accès est conservée. |
| Rechargement direct d’une route profonde | `/ressources-legales` rend le contenu et les assets depuis le shell SPA. | Conforme : le repli fonctionne au-delà des seules routes d’accueil et de recherche. |
| Route de service à import dynamique | `/services/garde` se charge depuis le shell SPA avec son contenu et ses assets. | Conforme sur le repli de route ; les contenus factuels de cette page restent un chantier distinct. |
| Cache PWA | Un service worker historique `public/sw.js` est livré avec des caches `dogwalking-v2` non versionnés ; son hook d’enregistrement n’est plus utilisé, mais un contrôleur déjà installé peut rester actif sur les téléphones. | Un nettoyage client retire désormais les anciens workers de même origine et les caches `dogwalking-*` après le montage de l’application. |
| Validation après redémarrage | L’accueil commence sur le chargeur de montage puis rend son contenu intégral et ses actions dans l’aperçu redémarré. | Conforme : aucun écran d’erreur ni écran blanc persistant n’est observé après hydratation. |
| Validation ciblée après redémarrage | L’accès direct à `/walkers` affiche brièvement le spinner de chargement puis rend la page complète de recherche des Accompagnateurs et ses actions. | Conforme : l’écran d’erreur « Impossible d’afficher cette page » n’est pas reproduit dans l’aperçu de travail. |
| Manifeste PWA | Le manifeste contient encore une description ancienne évoquant paiement et suivi GPS. | Métadonnée à assainir dans une vague de contenu dédiée ; elle n’est pas modifiée par le correctif de routage. |

> Aucune livraison de correction ne sera déclarée résolue tant que les rechargements directs des routes principales n’auront pas été vérifiés sur un support équivalent à l’hébergement cible.
