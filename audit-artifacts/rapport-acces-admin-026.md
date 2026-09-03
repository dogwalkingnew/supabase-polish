# Accès Admin temporaire — vague 026

Un bouton `Connexion Admin` a été ajouté à la première étape de `/auth`. Il est identifié par `data-testid="temporary-admin-login"`, porte le libellé « Connexion Admin — temporaire » et redirige vers le formulaire d’authentification avec `redirect=/admin`.

La protection métier n’est pas contournée : la route `/admin` reste protégée par `ProtectedRoute requiredRole="admin"`. Un compte non administrateur peut atteindre le formulaire mais ne peut pas entrer dans le tableau Admin après authentification.

Le bouton a été contrôlé visuellement en desktop 1440×900 et mobile 390×844. Il reste accessible, lisible, séparé des deux cartes Propriétaire/Accompagnateur et sans débordement mobile.

## Retrait ultérieur

À la clôture de la recette Admin, retirer le bloc portant `data-testid="temporary-admin-login"` dans `src/pages/Auth.tsx`, puis supprimer l’entrée correspondante du suivi `todo.md`. Ne pas modifier `ProtectedRoute`, la route `/admin` ou les règles de rôle.

## Validation technique

Le typecheck et le build passent. Le lint termine avec des avertissements existants mais zéro erreur. La livraison GitHub doit confirmer l’égalité du SHA local et distant après le push forcé sécurisé.
