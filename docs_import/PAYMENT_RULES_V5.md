# Règles de paiement Dogfinance v5.0 — Source de vérité

> **Document de référence unique.** Toute UI / edge function / facturation doit s'aligner sur ce fichier.
> Code source de vérité : [`src/lib/pricing.ts`](./src/lib/pricing.ts).

## 1. Modèle de commission

| Acteur | Taux | Effet |
|---|---|---|
| Propriétaire (client) | **+5 %** | Frais de service ajoutés au prix de base |
| Accompagnateur (prestataire) | **−13 %** | Commission prélevée sur le prix de base |
| **Plateforme Dogwalking** | **18 %** brut | 5 % client + 13 % prestataire |
| Net reversé à l'accompagnateur | **87 %** | du prix de base affiché |

### Exemple (mission 20 €)
- Propriétaire paie : `20 × 1,05 = 21,00 €`
- Accompagnateur reçoit : `20 × 0,87 = 17,40 €`
- Marge brute Dogwalking : `21,00 − 17,40 = 3,60 €` (18 % de 20 €)

## 2. Doggy Wallet

- **1 Doggy = 1 €** (conversion just-in-time, pas de spéculation)
- **Frais fixe recharge carte : 0,50 €** (couverture frais Stripe)
- Crédit mensuel récurrent (option utilisateur)
- Retrait possible côté accompagnateur via Stripe Connect Express

## 3. Sécurité du paiement

- Nom utilisé partout dans l'UI : **« Paiement Sécurisé »** (ne plus dire « séquestre »)
- Libération des fonds : code unique 6 chiffres saisi par l'accompagnateur après mission
- Auto-release : 72 h après fin de mission si aucune contestation (cron `auto_release_escrow`)

## 4. Constantes techniques

Définies dans [`src/lib/pricing.ts`](./src/lib/pricing.ts) :

```ts
OWNER_FEE_RATE         = 0.05   // +5 %
WALKER_COMMISSION_RATE = 0.13   // −13 %
PLATFORM_GROSS_RATE    = 0.18   // 18 %
WALLET_TOPUP_FIXED_FEE = 0.50   // €
```

⚠️ **Ne jamais hardcoder ces valeurs ailleurs.** Importer depuis `@/lib/pricing`.

## 5. Documents associés

- `Dogfinance_CDC_Master_v5.docx` — cahier des charges complet
- `Dogfinance_Actions_Restantes_v5.docx` — roadmap finalisation
- `Dogfinance_Checklist_Finale.csv` — checklist exportable
