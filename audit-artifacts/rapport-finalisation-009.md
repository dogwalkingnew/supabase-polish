# DogWalking — Rapport de finalisation 009

**Périmètre :** cohérence des flux d’annonces ouvertes, tableaux accessibles et nettoyage des routes de démonstration.

> Cette vague ne remet pas en service de paiement, de suivi GPS, de disponibilité garantie, de portefeuille, de facturation ou de fonction d’urgence. Les éléments sans mise en œuvre complète ont été retirés ou explicitement laissés hors du parcours actif.

## Flux rétablis de manière contrôlée

Les annonces ouvertes disposent désormais d’un parcours complet et atomique. Un Accompagnateur ayant un profil validé peut candidater une seule fois à une annonce en attente, avec un contrôle serveur sur l’identité, le statut de validation, la date, l’absence d’attribution et l’interdiction de candidater à sa propre demande. Une nouvelle tentative alors que la candidature est en attente retourne le même identifiant sans créer de doublon ni de seconde notification.

Le Propriétaire peut ensuite retenir ou refuser une candidature depuis sa demande. La sélection verrouille la réservation, lui attribue l’Accompagnateur, confirme la demande, rejette les autres candidatures encore en attente et notifie les personnes concernées dans la même opération. L’interface ne comporte plus de repli client susceptible d’écrire des états partiels.

| Élément | Contrôle ajouté | Résultat QA |
|---|---|---|
| Candidature Accompagnateur | RPC `apply_to_open_booking` ; contrôle de profil validé, demande ouverte, date et unicité | Création, idempotence, refus d’un profil non validé et notification Propriétaire validés dans une transaction annulée. |
| Décision Propriétaire | RPC `review_open_booking_application` ; verrouillage de demande et décision unique | Refus d’un non-Propriétaire, sélection, attribution, rejet des autres candidatures et deux notifications validés dans une transaction annulée. |
| Exposition des fonctions | Logique privilégiée dans `private`, enveloppe SQL invoker dans `public` | Aucune alerte de fonction nouvellement exposée dans l’analyse sécurité Supabase. |
| Routes historiques | Redirections vers les tableaux maintenus ou l’authentification | Les routes d’aperçu et les écrans de gains/données de démonstration ne servent plus de contenu actif. |

## Interfaces assainies

Le tableau Propriétaire n’affiche plus de portefeuille, crédit, facturation, suivi de promenade simulé, urgence médicale, carnet de santé ni état de vérification fabriqué. Il s’appuie sur les animaux, profils, missions et statuts remontés depuis Supabase. La gestion détaillée des animaux utilise l’éditeur existant relié à la base de données.

La recherche et l’inscription Accompagnateur ne promettent plus une disponibilité gérée, des tarifs collectés ou des services « disponibles » sans confirmation. Les libellés indiquent désormais les profils et services renseignés, le dépôt d’un dossier, sa validation administrative et les demandes auxquelles un Accompagnateur peut effectivement répondre.

## Limites conservées pour éviter une promesse non tenue

| Sujet | État dans cette version | Condition avant activation future |
|---|---|---|
| Disponibilités récurrentes | Non actives et non promises. | Modèle de calendrier, prévention des chevauchements, règles de fuseau horaire et recette multi-utilisateur. |
| Contre-proposition | Non proposée. | Historique versionné, expiration, acceptation/refus Propriétaire et cohérence avec les créneaux réservés. |
| Paiement, commission et facture | Non gérés dans DogWalking. | Décision éditeur, prestataire, conformité, fiscalité, remboursements et responsabilités validés. |
| Suivi GPS et urgence | Non proposés. | Consentement, sécurité, conservation, prestataire et protocole de réponse réel. |
| Santé et documents médicaux | Non proposés depuis le tableau Propriétaire. | Qualification des données sensibles, contrôle d’accès, conservation, consentement et procédure métier. |

## Contrôles techniques

Le contrôle TypeScript et la construction de production ont été exécutés avec succès après les corrections. L’analyse sécurité Supabase ne conserve que l’avertissement externe relatif à la protection contre les mots de passe compromis, qui nécessite une action dans les paramètres Auth de l’organisation. La prévisualisation mobile des annonces ouvertes et des redirections historiques a été vérifiée après redémarrage du serveur.
