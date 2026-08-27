# Configuration d’environnement de production

DogWalking exige une configuration Supabase explicite en production. Le client n’emploie une valeur de prévisualisation que pendant le développement local ; une construction de production sans variables applicatives échoue volontairement au premier accès au client.

| Variable | Requise | Usage | Règle de sécurité |
|---|---:|---|---|
| `VITE_SUPABASE_URL` | Oui | URL du projet Supabase côté navigateur | Utiliser l’URL du projet de production. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Oui | Clé publique Supabase côté navigateur | Ne jamais fournir de clé `service_role` ou secrète. |
| `VITE_ENABLE_OAUTH` | Non | Affichage des connexions Google et Apple | Garder `false` tant que les fournisseurs et URL de redirection Supabase ne sont pas validés. |
| `SUPABASE_URL` | Optionnelle | Rendu serveur éventuel | Doit correspondre au projet de production. |
| `SUPABASE_PUBLISHABLE_KEY` | Optionnelle | Rendu serveur éventuel | Utiliser uniquement une clé publique. |

Les fichiers `.env`, `.env.*` et `.dev.vars` sont exclus du dépôt. Les valeurs doivent être définies dans le gestionnaire de secrets de l’environnement d’hébergement, puis vérifiées par une construction de production et un test de connexion.

> Les préfixes `VITE_` rendent une variable disponible dans le navigateur. Ils ne doivent donc jamais contenir de secret, de clé d’administration Supabase ou de mot de passe.
