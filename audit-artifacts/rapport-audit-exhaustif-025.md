# Audit exhaustif des pages et du responsive — vague 025

## Couverture des routes

| Domaine | Routes contrôlées dans la table active | État |
|---|---|---|
| Public | `/`, `/walkers`, `/find-walkers`, `/annonces-libres`, `/nous-sommes-presents`, `/tarifs`, `/blog`, `/support`, `/ressources-legales` | Présentes et raccordées |
| Services | `/services/promenade`, `/services/garde`, `/services/visite`, `/services/garde-domicile`, `/services/garde-multi-animaux`, `/services/marche-reguliere` | Présentes et raccordées |
| Authentification | `/auth`, `/auth/callback` | Présentes |
| Propriétaire | `/dashboard`, `/dashboard-proprietaire`, `/mon-espace`, `/bookings/:id`, `/book/:walkerId`, `/dogs/add` | Protégées par rôle ou redirigées |
| Accompagnateur | `/walker/dashboard`, `/dashboard-promeneur`, `/espace-promeneur`, `/walker/register`, `/walker/:walkerId` | Protégées par rôle ou accessibles selon le parcours |
| Administration | `/admin` | Protégée par rôle Admin |
| Compatibilité | anciennes URLs de services et anciennes URLs de tableaux | Redirections explicites |

Les imports des pages routées ont été vérifiés : aucune cible de route manquante n’a été détectée. Les fichiers `.env`, dépendances et artefacts de build ne sont pas suivis par Git.

## Responsive et composition

Les pages publiques et les états d’authentification ont été capturés en 1440×900 et 390×844. Les tableaux Propriétaire et Accompagnateur utilisent des conteneurs fluides, des grilles qui passent en colonne unique sur mobile, des cartes extensibles et une navigation tactile. Les contrôles ont porté sur les largeurs fixes, les débordements horizontaux, les champs de recherche, les boutons, les cartes d’état, les bandeaux et les marges latérales.

Le tableau Propriétaire conserve ses parcours Accueil, Animaux, Missions et Profil ; le suivi ouvre le détail de réservation. Le tableau Accompagnateur conserve les réservations attribuées et les actions GO/réponse selon les permissions. Le tableau Admin reste séparé par son rôle et sa route dédiée.

## Validation technique

Le typecheck, le build et le lint s’exécutent sans erreur bloquante. Le push complet vers `dogwalkingnew/supabase-polish` a été effectué sur `main` avec `--force-with-lease` au SHA `2709b1f636656712e41c91f1664cef513bd9fe8f`, identique au SHA distant. La CI de ce SHA était encore en cours au moment de la rédaction ; sa conclusion doit être confirmée avant de qualifier la livraison comme totalement verte.

## Limites QA restantes

La capture automatisée des routes protégées montre volontairement l’authentification lorsqu’aucune session n’est injectée. Il reste donc à rejouer avec comptes QA réels les mutations Propriétaire, Accompagnateur et Admin : suivi, GO, accepter/refuser, édition d’animal, profil, validation Admin et contrôle RLS entre rôles. Le redéploiement et les routes profondes du domaine Lovable restent des validations externes.
