# Finalisation maximale — vague 027

La vérification du dépôt a confirmé que les routes et pages déjà inventoriées sont présentes, que le bouton Admin temporaire reste identifié et que le code local ne contient pas de nouvelle modification applicative non contrôlée.

Le typecheck, le build et le lint passent localement. Le lint produit 260 avertissements non bloquants existants, principalement des `any` explicites et des dépendances de hooks signalées ; aucun de ces avertissements n’empêche la compilation.

Les derniers échecs CI observés ne provenaient pas du code : le build terminait correctement, puis `pnpm audit --prod --audit-level=high` échouait sur `ERR_SOCKET_TIMEOUT` lors de l’appel HTTPS au registre npm. Le workflow CI a donc été renforcé par trois tentatives espacées de quinze secondes. Le niveau d’audit reste inchangé et l’échec reste obligatoire si les trois tentatives échouent.

Les validations encore externes sont la recette authentifiée GO/Suivre/Admin, les règles RLS entre rôles, la confirmation du domaine Lovable, les variables Supabase de production, les documents juridiques et le retrait final du bouton Admin temporaire.
