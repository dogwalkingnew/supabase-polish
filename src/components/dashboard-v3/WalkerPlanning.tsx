import { useState } from "react";
import { Clock, MapPin, User2, PlayCircle, Check, Plus } from "lucide-react";
import WalkerHero from "./WalkerHero";
import heroImg from "@/assets/walker-hero-home.jpg";

export interface PlanningMission {
  id: string; client: string; pet: string; address: string; time: string; durationMin: number; price: number;
  type: "Promenade" | "Garde" | "Visite"; status?: "Confirmée" | "À démarrer";
}

interface WalkerPlanningProps {
  assigned: PlanningMission[];
  open: PlanningMission[];
  onStart?: (id: string) => void;
  onAccept?: (id: string) => void;
}

const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const WalkerPlanning = ({ assigned, open, onStart, onAccept }: WalkerPlanningProps) => {
  const [tab, setTab] = useState<"assigned" | "open">("assigned");
  const [activeDay, setActiveDay] = useState(2);

  const list = tab === "assigned" ? assigned : open;

  return (
    <div className="bg-[#0E1428] min-h-dvh pb-28 text-white">
      <WalkerHero image={heroImg} alt="Planning" />

      <main className="px-4 -mt-4 max-w-lg mx-auto space-y-5 relative z-10">
        {/* Calendar week */}
        <section className="bg-[#1A2240] rounded-2xl p-3 ring-1 ring-white/5">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="font-bold text-sm">Cette semaine</h2>
            <span className="text-xs text-white/50">Mai 2024</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              const active = i === activeDay;
              return (
                <button key={d} onClick={() => setActiveDay(i)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${active ? "bg-[#10B981] text-white" : "text-white/70 hover:bg-white/5"}`}>
                  <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{d}</span>
                  <span className="text-lg font-bold leading-none">{13 + i}</span>
                  <span className={`w-1 h-1 rounded-full ${active ? "bg-[#D4A574]" : i < 5 ? "bg-[#D4A574]/60" : "bg-transparent"}`} />
                </button>
              );
            })}
          </div>
        </section>

        {/* Tabs */}
        <div className="bg-[#1A2240] rounded-2xl p-1.5 flex ring-1 ring-white/5">
          {[
            { key: "assigned" as const, label: "Mes missions" },
            { key: "open" as const, label: "Missions libres" },
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

        {/* Mission list */}
        <section className="space-y-3">
          {list.length === 0 && (
            <p className="text-center text-white/50 text-sm py-10">Aucune mission</p>
          )}
          {list.map((m) => (
            <article key={m.id} className="bg-[#1A2240] rounded-2xl p-4 ring-1 ring-white/5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-[#D4A574]/20 text-[#D4A574] px-2 py-0.5 rounded-full">{m.type}</span>
                    {m.status === "Confirmée" && <span className="text-[10px] font-bold uppercase tracking-wide bg-[#27AE60]/20 text-[#27AE60] px-2 py-0.5 rounded-full">Confirmée</span>}
                  </div>
                  <h3 className="font-bold text-lg leading-tight">{m.pet}</h3>
                  <div className="text-xs text-white/70 mt-1 flex items-center gap-1"><User2 className="w-3.5 h-3.5" />{m.client}</div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-[#D4A574] leading-none">{m.price}€</p>
                  <p className="text-[10px] text-white/50 mt-1">{m.durationMin} min</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-white/80">
                <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#D4A574]" />{m.time}</span>
                <span className="inline-flex items-center gap-1.5 truncate"><MapPin className="w-4 h-4 text-[#D4A574]" />{m.address}</span>
              </div>
              <button
                onClick={() => (tab === "assigned" ? onStart?.(m.id) : onAccept?.(m.id))}
                className={`w-full mt-4 py-3 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 ${tab === "assigned" ? "bg-[#10B981] text-white" : "bg-[#D4A574] text-[#1A1A2E]"}`}>
                {tab === "assigned" ? (<><PlayCircle className="w-4 h-4" /> Démarrer</>) : (<><Plus className="w-4 h-4" /> Accepter la mission</>)}
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default WalkerPlanning;
