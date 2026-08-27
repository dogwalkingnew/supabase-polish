# Direction de design — DogWalking

## Référence de vérité

Le dépôt `dogwalkingnew/supabase-polish` et les sources auditées fournies constituent la **référence visuelle et fonctionnelle** de cette finalisation. L’objectif n’est pas de redessiner DogWalking : les corrections doivent préserver la hiérarchie, les tableaux de bord V3, les tonalités chaleureuses et l’expérience de mise en relation entre propriétaires et accompagnateurs. Toute évolution visuelle doit être strictement corrective : lisibilité, cohérence, responsive, accessibilité et honnêteté des états fonctionnels.

## Approche retenue — « Confiance canine de proximité »

**Mouvement de design.** Interface de service locale chaleureuse, à la croisée d’un éditorial lifestyle français et d’un tableau de bord produit utilitaire.

**Principes directeurs.** Les informations de mission doivent rester immédiatement scannables ; les actions importantes doivent être explicites et confirmées ; les tableaux de bord doivent hiérarchiser l’opérationnel avant la décoration ; les écrans publics doivent conserver une atmosphère calme, humaine et responsable.

**Philosophie de couleur.** Les verts naturels et les tons sable portent la confiance, le soin et la proximité. Les couleurs sémantiques restent réservées aux statuts, alertes et confirmations afin que les décisions opérationnelles ne soient jamais ambiguës.

**Paradigme de mise en page.** Les parcours publics privilégient des blocs éditoriaux respirants et une navigation nette. Les espaces propriétaire et accompagnateur reposent sur une colonne de navigation persistante en grand écran, transformée en navigation compacte sur mobile, avec des zones de décision priorisées dans le flux principal.

**Éléments signatures.** Cartes informatives chaleureuses et aérées ; repères d’état de mission clairement colorés ; motifs organiques et photographies de promenade employés avec retenue.

**Philosophie d’interaction.** Une action sensible doit offrir une intention lisible, un retour d’état et un résultat persistant. Les transitions ne servent qu’à soutenir la compréhension ; aucun mouvement ne doit ralentir les tâches répétées.

**Animation.** Interactions brèves, avec retour tactile discret ; entrées de panneaux et dialogues sous 300 ms ; respect de `prefers-reduced-motion`. Ne pas introduire d’animation décorative lors d’une correction fonctionnelle.

**Système typographique.** Conserver la typographie définie dans les sources. Les titres structurent les étapes et les statuts ; le corps de texte doit rester lisible en contexte mobile, avec une densité appropriée aux tableaux de bord.

**Essence de marque.** DogWalking met en relation propriétaires et accompagnateurs pour organiser des promenades et services canins de proximité avec des parcours clairs et rassurants. **Personnalité :** chaleureuse, fiable, pragmatique.

**Voix de marque.** Les titres sont directs et orientés vers l’action utile ; les CTA indiquent précisément ce qui se produit. Exemples : « Trouvez un accompagnateur près de chez vous » et « Suivre la mission en cours ».

**Wordmark et logo.** Le logotype et les actifs existants du dépôt sont la référence. Le pictogramme de réserve généré n’est utilisé qu’en cas d’absence ou de défaillance d’un actif existant, jamais pour remplacer arbitrairement la marque en place.

**Couleur de marque signature.** Le vert forêt DogWalking, employé comme repère de confiance et non comme décor omniprésent.

## Règle de décision

Avant toute modification d’interface, vérifier : **« Cette correction renforce-t-elle la confiance, la clarté et la continuité de l’expérience DogWalking, sans diluer son design existant ? »**

## Style Decisions

- Le vert forêt DogWalking est l’unique couleur d’action et de sélection ; le menthe soutient les états doux, le sable et le blanc chaud portent les surfaces, et le bleu reste réservé aux informations réellement sémantiques.
- Les pages publiques alternent photographie de promenade, panneaux éditoriaux sable et cartes utiles aérées ; elles évitent l’accumulation de blocs SaaS centrés et répétitifs.
- Une ligne de parcours organique, inspirée d’un itinéraire de promenade, sert de motif de marque discret dans les sections éditoriales et opérationnelles ; elle ne doit pas devenir un décor dominant.
- Chaque page de service associe son héros à un panneau pratique propre au besoin présenté ; elle ne se limite pas à une succession générique de cartes, d’étapes, de FAQ et de bandeau d’action.
- Tout CTA nomme le prochain geste dans DogWalking, par exemple « Consulter les profils », « Trouver un Accompagnateur » ou « Déposer une annonce » ; une action secondaire vague ou illisible est interdite.
