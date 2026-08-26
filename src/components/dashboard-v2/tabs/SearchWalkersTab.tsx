import { useState } from "react";
import { Search, MapPin, Star, Shield, Megaphone, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useNearbyWalkers } from "@/hooks/useNearbyWalkers";
import type { Database } from "@/integrations/supabase/types";

type ServiceType = Database["public"]["Enums"]["service_type"];

const SERVICES: { key: ServiceType | "all"; label: string; floor: number | null }[] = [
  { key: "all", label: "Tous", floor: null },
  { key: "promenade", label: "Promenade", floor: 12 },
  { key: "garde", label: "Garde", floor: 25 },
  { key: "visite", label: "Visite", floor: 12 },
];

const SearchWalkersTab = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ServiceType | "all">("all");
  const { data: walkers = [], isLoading } = useNearbyWalkers();

  const filtered = walkers.filter((w: any) =>
    filter === "all" ? true : w.services?.includes(filter)
  );

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      <div className="flex items-center gap-2">
        <Search className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-black text-foreground">Recherche Accompagnateurs</h2>
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/find-walkers")}
          className="bg-card rounded-2xl shadow-card p-4 text-left flex flex-col gap-2 border border-border/50"
        >
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-extrabold text-foreground">Trouver</span>
          <span className="text-[11px] text-muted-foreground font-medium">Accompagnateurs Certifiés à proximité</span>
          <ArrowRight className="w-3.5 h-3.5 text-primary mt-1" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/annonces-libres")}
          className="bg-card rounded-2xl shadow-card p-4 text-left flex flex-col gap-2 border border-border/50"
        >
          <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
            <Megaphone className="w-4 h-4 text-accent" />
          </div>
          <span className="text-sm font-extrabold text-foreground">Annonce libre</span>
          <span className="text-[11px] text-muted-foreground font-medium">Décrivez votre besoin, recevez des offres</span>
          <ArrowRight className="w-3.5 h-3.5 text-accent mt-1" />
        </motion.button>
      </div>

      {/* Filtres service */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SERVICES.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
              filter === s.key ? "gradient-primary text-white shadow-card" : "bg-muted text-muted-foreground"
            }`}
          >
            {s.label}
            {s.floor && <span className="ml-1 opacity-70">dès {s.floor}€</span>}
          </button>
        ))}
      </div>

      {/* Liste */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl shadow-card p-3 animate-pulse h-20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-sm text-muted-foreground">
          Aucun Accompagnateur Certifié pour ce filtre.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.slice(0, 20).map((w: any, i: number) => (
            <motion.button
              key={w.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => navigate(`/walker/${w.user_id}`)}
              className="w-full bg-card rounded-2xl shadow-card p-3 flex items-center gap-3 border border-border/50 hover:border-primary/30 transition-all text-left"
            >
              {w.profiles?.avatar_url ? (
                <img src={w.profiles.avatar_url} alt={w.profiles.first_name} className="w-12 h-12 rounded-xl object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-extrabold text-foreground/60">
                  {(w.profiles?.first_name || "A").charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-foreground truncate">
                    {w.profiles?.first_name || "Accompagnateur"} {(w.profiles?.last_name || "")[0] || ""}.
                  </span>
                  {w.verified && (
                    <span className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      <Shield className="w-2.5 h-2.5" /> Certifié
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[11px] font-bold">{Number(w.rating || 0).toFixed(1)}</span>
                    <span className="text-[10px] text-muted-foreground">({w.total_reviews || 0})</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MapPin className="w-2.5 h-2.5" />
                    {w.service_radius_km || 5}km
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-base font-black text-primary">{w.hourly_rate || 15}€</span>
                <p className="text-[9px] text-muted-foreground font-bold uppercase">/ mission</p>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchWalkersTab;
