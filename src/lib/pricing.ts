/**
 * Pricing & commission model — Dogfinance v5.0
 *
 * Modèle financier validé (cf. Cahier des Charges Financier v5.0) :
 *   - Prix de base : fixé par l'Accompagnateur ou annonce libre
 *   - Côté propriétaire : prix × 1.05  (frais de service 5%)
 *   - Côté accompagnateur : prix × 0.87 (commission 13%)
 *   - Marge brute Dogwalking : 18% (5% client + 13% prestataire)
 *
 * Monnaie virtuelle : 1 € = 1 Doggy (conversion just-in-time).
 * Frais fixes sécurité : 0,50 € sur les recharges Wallet par carte.
 */

export const OWNER_FEE_RATE = 0.05;        // +5% côté propriétaire
export const WALKER_COMMISSION_RATE = 0.13; // -13% côté accompagnateur
export const PLATFORM_GROSS_RATE = OWNER_FEE_RATE + WALKER_COMMISSION_RATE; // 18%
export const WALLET_TOPUP_FIXED_FEE = 0.5;  // 0,50 € de frais fixe sur recharge carte

export interface PriceBreakdown {
  base: number;            // prix mission
  ownerFee: number;        // 5% client
  ownerTotal: number;      // ce que paie le propriétaire (105%)
  walkerCommission: number;// 13% prélevé au prestataire
  walkerNet: number;       // 87% reversé à l'accompagnateur
  platformGross: number;   // 18% marge brute
}

/** Round to 2 decimals (centimes). */
const r2 = (n: number) => Math.round(n * 100) / 100;

export function computePrice(base: number): PriceBreakdown {
  const ownerFee = r2(base * OWNER_FEE_RATE);
  const ownerTotal = r2(base + ownerFee);
  const walkerCommission = r2(base * WALKER_COMMISSION_RATE);
  const walkerNet = r2(base - walkerCommission);
  const platformGross = r2(ownerFee + walkerCommission);
  return { base: r2(base), ownerFee, ownerTotal, walkerCommission, walkerNet, platformGross };
}

/** Convertit Euros -> Doggies (1:1 just-in-time). */
export const eurosToDoggies = (eur: number) => r2(eur);
/** Convertit Doggies -> Euros (1:1). */
export const doggiesToEuros = (dog: number) => r2(dog);

/** Frais sur recharge wallet par carte. */
export const computeTopupCharge = (amount: number) => r2(amount + WALLET_TOPUP_FIXED_FEE);
