import { PlayCircle, MapPin, Clock, Star, Euro, TrendingUp, Bell, ChevronRight, User2 } from "lucide-react";
import WalkerHero from "./WalkerHero";
import heroImg from "@/assets/walker-hero-home.jpg";
import dogGolden from "@/assets/dog-golden.jpg";

interface ActiveMission { id: string; client: string; pet: string; petPhoto?: string; address: string; time: string; durationMin: number; price: number; }
interface Review { id: string; from: string; rating: number; comment: string; date: string; }

interface WalkerHomeProps {
  online?: boolean;
  onToggleOnline?: () => void;
  todayEarnings: number;
  weekEarnings: number;
  missionsCount: number;
  nextMission?: ActiveMission;
  reviews: Review[];
  onStartMission?: () => void;
}

const WalkerHome = ({ online = true, onToggleOnline, todayEarnings, weekEarnings, missionsCount, nextMission, reviews, onStartMission }: WalkerHomeProps) => {
  return (
    <div className="bg-[#0E1428] min-h-dvh pb-28 text-white">
      <WalkerHero image={heroImg} alt="Accompagnateur en mission" online={online} onToggleOnline={onToggleOnline} />

      <main className="px-4 -mt-4 max-w-lg mx-auto space-y-5 relative z-10">
        {/* GO Mission */}
        <button onClick={onStartMission}
          className="w-full h-[78px] rounded-[18px] bg-gradient-to-r from-[#10B981] to-[#176650] text-white flex items-center justify-between pl-3 pr-5 shadow-[0_10px_30px_-12px_rgba(30,123,95,0.8)] ring-1 ring-[#D4A574]/30">
          <span className="w-14 h-14 rounded-full bg-[#0E1428]/40 ring-1 ring-[#D4A574]/60 flex items-center justify-center">
            <PlayCircle className="w-7 h-7 text-[#D4A574]" strokeWidth={1.6} />
          </span>
          <span className="text-lg font-bold tracking-[0.04em] uppercase">Démarrer la mission</span>
          <ChevronRight className="w-7 h-7 text-white/90" strokeWidth={2} />
        </button>

        {/* Stats du jour */}
        <section className="grid grid-cols-3 gap-3">
          {[
            { label: "Aujourd'hui", value: `${todayEarnings}€`, icon: Euro, accent: "#D4A574" },
            { label: "Semaine", value: `${weekEarnings}€`, icon: TrendingUp, accent: "#27AE60" },
            { label: "Missions", value: `${missionsCount}`, icon: Bell, accent: "#D4A574" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <article key={s.label} className="bg-[#1A2240] rounded-2xl p-3.5 ring-1 ring-white/5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${s.accent}25` }}>
                  <Icon className="w-4 h-4" style={{ color: s.accent }} />
                </div>
                <p className="text-[10px] uppercase tracking-wide text-white/60 font-semibold">{s.label}</p>
                <p className="text-xl font-bold text-white mt-0.5">{s.value}</p>
              </article>
            );
          })}
        </section>

        {/* Prochaine mission */}
        {nextMission && (
          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-lg font-bold tracking-tight">Prochaine Mission</h2>
              <span className="text-[10px] font-bold uppercase tracking-wide bg-[#D4A574]/20 text-[#D4A574] px-2 py-1 rounded-full">Confirmée</span>
            </div>
            <article className="bg-[#1A2240] rounded-2xl p-4 ring-1 ring-white/5">
              <div className="flex items-start gap-3">
                <img src={nextMission.petPhoto || dogGolden} alt={nextMission.pet} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/60">Pour {nextMission.client}</p>
                  <h3 className="font-bold text-lg leading-tight">{nextMission.pet}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-white/80">
                    <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#D4A574]" />{nextMission.time}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#D4A574]" />{nextMission.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#D4A574] leading-none">{nextMission.price}€</p>
                  <p className="text-[10px] text-white/50 mt-1">{nextMission.durationMin} min</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button className="py-2.5 rounded-xl bg-white/5 text-white text-sm font-semibold ring-1 ring-white/10">Détails</button>
                <button className="py-2.5 rounded-xl bg-[#10B981] text-white text-sm font-bold">Itinéraire</button>
              </div>
            </article>
          </section>
        )}

        {/* Évaluations récentes */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-lg font-bold tracking-tight">Évaluations récentes</h2>
            <button className="text-xs font-semibold text-[#D4A574]">Voir tout</button>
          </div>
          <div className="space-y-2">
            {reviews.slice(0, 2).map((r) => (
              <article key={r.id} className="bg-[#1A2240] rounded-2xl p-3.5 ring-1 ring-white/5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="inline-flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#D4A574]/20 flex items-center justify-center"><User2 className="w-4 h-4 text-[#D4A574]" /></span>
                    <p className="font-semibold text-sm">{r.from}</p>
                  </div>
                  <div className="inline-flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-[#D4A574] text-[#D4A574]" : "text-white/20"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">"{r.comment}"</p>
                <p className="text-[10px] text-white/40 mt-1.5">{r.date}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default WalkerHome;
