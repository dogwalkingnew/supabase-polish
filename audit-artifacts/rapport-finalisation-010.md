# DogWalking — Rapport de finalisation 010

**Périmètre :** dépendances de production, politiques de stockage, composants de paiement résiduels et intégration continue GitHub.

> La vague 010 supprime les vulnérabilités connues par l’audit de production et réduit les droits de stockage. Elle ne décide pas à la place de l’éditeur si les avatars et photos d’animaux doivent être publics : ces compartiments demeurent publics en lecture jusqu’à une décision RGPD explicite.

## Correctifs de dépendances

`react-router-dom` est passé de 6.30.6 à **7.18.2**. L’audit avait d’abord exposé les deux alertes modérées de la branche 6, puis une alerte haute dans 7.18.0 ; la version 7.18.2 corrige ces alertes. Le contrôle TypeScript, la construction SSR de production et la navigation vers l’authentification ont été rejoués après la migration. L’audit de dépendances de production retourne désormais **aucune vulnérabilité connue**. La documentation officielle indique que la migration v6 vers v7 exige Node 20+ et React 18+ ; le projet utilise Node 22 et React 19. [1]

Le contrôle des pairs signale encore des écarts transitoires dans des dépendances de développement (`nitro`/`h3`, runtime wasm) et le support de React 19 déclaré par `react-helmet-async`. Ces écarts ne produisent ni erreur TypeScript, ni erreur de build, ni vulnérabilité dans l’audit. Ils restent consignés pour une mise à jour groupée des outils, plutôt qu’un forçage isolé risqué.

| Contrôle | Résultat |
|---|---|
| `pnpm run typecheck` | Réussi avec React Router 7.18.2. |
| `pnpm run build` | Réussi ; rendu SSR produit. |
| `pnpm audit --prod --audit-level=high` | Réussi, aucune vulnérabilité connue. |
| Lint | 0 erreur, 337 avertissements historiques. Les avertissements sont documentés et ne sont pas masqués comme des corrections. |

## Stockage et confidentialité

La migration `20260827000200_restrict_storage_policies_to_authenticated.sql` remplace les politiques Storage de modification ou de lecture privée qui ciblaient le rôle `public`. Les autorisations correspondantes ciblent maintenant `authenticated`, sans changer la condition d’identité fondée sur le premier dossier du chemin. Les règles de lecture publique d’`avatars` et `dog-photos` restent volontairement inchangées, car cela relève d’une décision de produit et de conformité. Supabase rappelle que les politiques Storage s’appliquent à `storage.objects` et que les compartiments publics rendent leurs objets accessibles par URL publique. [2]

| Compartiment | Visibilité | Droit après vague 010 |
|---|---|---|
| `walk-proofs` | Privé | Upload Accompagnateur authentifié par chemin ; lecture Accompagnateur, Propriétaire de la réservation ou Administrateur authentifié. |
| `walker-documents` | Privé | Upload, modification et lecture par l’Accompagnateur authentifié concerné ; lecture Administrateur authentifié. |
| `avatars` | Public | Lecture publique conservée ; upload, modification et suppression réservés à l’utilisateur authentifié qui possède le chemin. |
| `dog-photos` | Public | Lecture publique conservée ; upload, modification et suppression réservés au propriétaire authentifié du chemin. |

Une recette transactionnelle annulée a validé l’upload et la lecture Accompagnateur, la lecture du Propriétaire associé, le refus pour une identité tierce et le refus d’un upload anonyme dans `walk-proofs`.

## Modules et CI

Les écrans historiques inaccessibles contenant des portefeuilles, gains, factures et paiements ont été retirés, ainsi que le service de génération de facture qui n’était plus importé par un parcours actif. Les routes principales utilisaient déjà les tableaux factuels de la vague 009.

La CI GitHub a échoué lors de sa première exécution parce que `actions/setup-node` cherchait le cache pnpm avant que pnpm ne soit installé. L’ordre des deux étapes a été corrigé : pnpm est préparé avant Node et sa mise en cache. Le prochain push déclenchera donc le contrôle réel `installation verrouillée → typecheck → lint → build → audit`.

## Restes à valider

| Sujet | Action nécessaire |
|---|---|
| Protection GitHub | Attendre la CI corrigée et réussie, puis imposer son statut sur `main`, les revues et l’interdiction des push forcés. |
| Photos publiques | Décider et documenter si avatars et photos d’animaux peuvent être accessibles par URL publique ; sinon planifier une migration vers URL signées et mises à jour UI. |
| Auth Supabase | Confirmer le domaine final, les URL de redirection et activer la protection contre les mots de passe compromis si le plan le permet. |
| Outils | Programmer une mise à jour compatible de `react-helmet-async` et des dépendances Nitro signalées par le contrôle de pairs. |

## Références

[1] [React Router — Upgrading from v6](https://reactrouter.com/upgrading/v6)  
[2] [Supabase — Storage access control](https://supabase.com/docs/guides/storage/security/access-control)
