import { useState } from "react";
import { TrendingUp, ArrowUpRight, CreditCard, Gift, Calendar } from "lucide-react";
import WalkerHero from "./WalkerHero";
import heroImg from "@/assets/walker-hero-home.jpg";

interface DetailRow { id: string; date: string; client: string; type: string; amount: number; }
interface Payout { id: string; date: string; amount: number; status: "Versé" | "En cours"; }

interface WalkerRevenusProps {
  monthEarnings: number;
  weekChart: number[];
  details: DetailRow[];
  payouts: Payout[];
}

const WalkerRevenus = ({ monthEarnings, weekChart, details, payouts }: WalkerRevenusProps) => {
  const [tab, setTab] = useState<"resume" | "detail" | "paiements">("resume");
  const max = Math.max(...weekChart, 1);

  return (
    <div className="bg-[#0E1428] min-h-dvh pb-28 text-white">
      <WalkerHero image={heroImg} alt="Revenus" />

      <main className="px-4 -mt-4 max-w-lg mx-auto space-y-5 relative z-10">
        {/* Big amount */}
        <section className="bg-gradient-to-br from-[#10B981] to-[#0F4F3D] rounded-3xl p-5 ring-1 ring-[#D4A574]/30 shadow-[0_12px_40px_-15px_rgba(30,123,95,0.8)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/70 font-semibold">Revenus du mois</p>
              <p className="text-5xl font-light mt-2 tracking-tight">{monthEarnings.toLocaleString("fr-FR")}<span className="text-2xl text-[#D4A574] ml-1">€</span></p>
              <p className="inline-flex items-center gap-1 mt-3 text-xs text-[#D4A574] font-semibold"><ArrowUpRight className="w-3.5 h-3.5" />+18% vs mois dernier</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-[#0E1428]/40 ring-1 ring-[#D4A574]/60 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-[#D4A574]" />
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="bg-[#1A2240] rounded-2xl p-1.5 flex ring-1 ring-white/5">
          {[
            { key: "resume" as const, label: "Résumé" },
            { key: "detail" as const, label: "Détail" },
            { key: "paiements" as const, label: "Paiements" },
          ].map((t) => {
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${active ? "bg-[#10B981] text-white" : "text-white/60"}`}>
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "resume" && (
          <>
            <section className="bg-[#1A2240] rounded-2xl p-4 ring-1 ring-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Cette semaine</h3>
                <span className="text-xs text-white/50">7 derniers jours</span>
              </div>
              <div className="flex items-end justify-between gap-2 h-32">
                {weekChart.map((v, i) => {
                  const h = Math.max(8, Math.round((v / max) * 100));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full rounded-t-lg bg-gradient-to-t from-[#10B981] to-[#D4A574]" style={{ height: `${h}%` }} />
                      <span className="text-[10px] text-white/50 font-semibold">{["L","M","M","J","V","S","D"][i]}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="bg-[#1A2240] rounded-2xl p-4 ring-1 ring-white/5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#D4A574]/20 flex items-center justify-center"><Gift className="w-6 h-6 text-[#D4A574]" /></div>
              <div className="flex-1">
                <p className="font-bold">Bonus fidélité disponible</p>
                <p className="text-xs text-white/60">+30€ si vous réalisez 5 missions cette semaine</p>
              </div>
            </section>
          </>
        )}

        {tab === "detail" && (
          <section className="bg-[#1A2240] rounded-2xl ring-1 ring-white/5 overflow-hidden">
            <ul className="divide-y divide-white/5">
              {details.map((d) => (
                <li key={d.id} className="px-4 py-3 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#D4A574] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{d.type} · {d.client}</p>
                    <p className="text-[11px] text-white/50">{d.date}</p>
                  </div>
                  <p className="font-bold text-[#D4A574]">+{d.amount}€</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === "paiements" && (
          <section className="space-y-2">
            {payouts.map((p) => (
              <article key={p.id} className="bg-[#1A2240] rounded-2xl p-4 ring-1 ring-white/5 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#10B981]/25 flex items-center justify-center"><CreditCard className="w-5 h-5 text-[#D4A574]" /></div>
                <div className="flex-1">
                  <p className="font-bold">{p.amount.toFixed(2)} €</p>
                  <p className="text-xs text-white/50">{p.date}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${p.status === "Versé" ? "bg-[#27AE60]/20 text-[#27AE60]" : "bg-[#D4A574]/20 text-[#D4A574]"}`}>{p.status}</span>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default WalkerRevenus;
