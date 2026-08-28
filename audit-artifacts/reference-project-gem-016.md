# Référence visuelle — project-gem-v2-final

## Source

Fichier fourni par l’utilisateur : `/home/ubuntu/upload/project-gem-v2-final.zip`.

## Caractéristiques relevées

La référence utilise une interface claire avec une palette émeraude (`hsl(160 84% 39%)`) comme primaire et un bleu océan (`hsl(200 80% 45%)`) comme accent. Elle emploie Nunito pour les titres et le corps, des surfaces blanches et beige chaud, des gradients primaires et CTA, des ombres douces, une élévation au survol et des helpers de texte en gradient.

Les utilitaires importants sont `.animated-underline`, `.glow-primary`, `.glow-accent`, `.walker-header-gradient`, les helpers `gradient-*` et `shadow-*`, ainsi qu’une navigation mobile de tableau en verre dépoli (`backdrop-blur-xl`) avec état actif en pastille, retours tactiles Framer Motion et bouton central gradient « GO ». Les cartes de métriques utilisent une tuile d’icône gradient, une entrée étagée et une élévation au survol.

## Adaptation appliquée à DogWalking

DogWalking conserve ses tokens HSL et son identité émeraude/beige. Le héros public reçoit un overlay plus sombre et contrasté, un titre avec gradient émeraude/cyan, des CTA avec gradient et élévation, et des pastilles plus lisibles. La barre mobile Propriétaire reçoit une surface vitrée, un état actif en pastille, une élévation et des feedbacks hover/tap. Les tableaux Accompagnateur et Administrateur reçoivent un bandeau gradient avec texte contrasté et actions lisibles. Les cartes `AdminMetrics` reçoivent des tuiles d’icône gradient et la classe d’interaction partagée.

## Validation intermédiaire

`pnpm run typecheck`, `pnpm run lint`, `pnpm run build` et `pnpm run audit:prod` passent après les adaptations. La sonde navigateur avec attente d’hydratation confirme le rendu de `/`, `/walkers`, `/services/garde`, `/services/visite`, `/services/garde-multi-animaux` et l’état 404 de `/services/visite-sanitaire`. Une capture à froid trop immédiate peut encore montrer le spinner ; la capture isolée de l’accueil après chargement affiche le héros complet et contrasté.
