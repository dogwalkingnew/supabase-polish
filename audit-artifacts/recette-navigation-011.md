# DogWalking — Recette de navigation 011

**Date :** 27 août 2026  
**Contexte :** session visiteur non authentifiée, après migration vers React Router 7.18.2.

| URL demandée | Résultat observé | Verdict |
|---|---|---|
| `/dashboard` | Redirection vers `/auth?redirect=%2Fdashboard` | Conforme : le retour reste un chemin interne encodé. |
| `/walker/dashboard` | Redirection vers `/auth?redirect=%2Fwalker%2Fdashboard` | Conforme : le retour reste un chemin interne encodé. |
| `/` | Accueil mobile chargé avec navigation compacte et texte lisible sur l’image. | Conforme visuellement. |
| `/auth` | Sélection de rôle chargée avec surface claire, identité DogWalking et actions lisibles. | Conforme visuellement. |
| `/walkers` | Recherche publique mobile accessible. | Conforme visuellement ; le libellé de confirmation de créneau a été corrigé pendant la recette. |
| `/annonces-libres` | Liste publique et action de dépôt affichées ; information explicite sur l’absence de paiement intégré. | Conforme visuellement. |
| `/support` et `/ressources-legales` | Contenu accessible et documents légaux présentés comme provisoires. | Conforme : aucune donnée légale fictive. |
| Anciennes routes tableau | Redirection vers le parcours d’authentification en session visiteur. | Conforme : les écrans de démonstration ne sont plus exposés. |
| `/auth?mode=reset` | Formulaire de choix et confirmation d’un nouveau mot de passe, sans soumission en l’absence de jeton de récupération. | Conforme visuellement ; la mise à jour réelle requiert le lien Supabase reçu par e-mail. |
| `/auth?redirect=https%3A%2F%2Fevil.example` | L’écran d’authentification DogWalking reste affiché ; aucun départ vers un domaine externe. | Conforme : la valeur est refusée par le filtre de chemin interne. |

> Cette recette ne remplace pas la validation métier avec un compte Propriétaire, Accompagnateur et Administrateur réels. Les scénarios base de données correspondants ont été contrôlés séparément avec les comptes QA autorisés et des transactions annulées. La réception effective des e-mails Supabase et l’acceptation de l’URL de callback par la liste de redirections autorisées doivent être validées dans l’environnement de production avant ouverture publique.
