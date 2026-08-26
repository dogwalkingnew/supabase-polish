import { useState, useEffect } from "react";
import { Briefcase, MapPin, Calendar, Clock, Send, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const SERVICES = [
  { key: "all", label: "Toutes" },
  { key: "promenade", label: "Promenade" },
  { key: "garde", label: "Garde" },
  { key: "visite", label: "Visite" },
] as const;

const useFreeMissions = () =>
  useQuery({
    queryKey: ["free_missions"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("bookings")
        .select("*, dogs(name, photo_url, breed), profiles!bookings_owner_id_fkey(first_name, city)")
        .is("walker_id", null)
        .eq("status", "pending")
        .order("scheduled_date", { ascending: true })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
    staleTime: 30_000,
  });

const FreeMissionsTab = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: missions = [], isLoading } = useFreeMissions();
  const [filter, setFilter] = useState<string>("all");
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // Realtime refresh
  useEffect(() => {
    const ch = supabase
      .channel("free-missions")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        qc.invalidateQueries({ queryKey: ["free_missions"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const filtered = (missions as any[]).filter((m) =>
    filter === "all" ? true : m.service_type === filter
  );

  const counts = SERVICES.reduce<Record<string, number>>((acc, s) => {
    acc[s.key] = s.key === "all"
      ? (missions as any[]).length
      : (missions as any[]).filter((m: any) => m.service_type === s.key).length;
    return acc;
  }, {});

  const handlePostuler = async (m: any) => {
    if (!user) {
      toast.error("Connectez-vous pour postuler");
      return;
    }
    setSubmittingId(m.id);
    try {
      const ownerName = m.profiles?.first_name || "le propriétaire";
      // Enregistre la candidature (table dédiée)
      await (supabase as any).from("booking_applications").insert({
        booking_id: m.id,
        walker_id: user.id,
        status: "pending",
      });
      // Notification au propriétaire (pas d'assignation auto — owner choisit)
      await (supabase as any).from("notifications").insert({
        user_id: m.owner_id,
        title: "🙋 Nouvelle candidature",
        message: `Un Accompagnateur Certifié souhaite réaliser la mission pour ${m.dogs?.name || "votre animal"} (${m.scheduled_date}).`,
        type: "booking",
        link: `/dashboard?tab=reservations`,
        metadata: { booking_id: m.id, applicant_id: user.id },
      });
      toast.success(`Candidature envoyée à ${ownerName} !`);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'envoi");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      <div className="flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-black text-foreground">Missions Libres</h2>
      </div>
      <p className="text-xs text-muted-foreground font-medium px-1">
        Annonces publiées par les propriétaires sans accompagnateur assigné. Postulez pour proposer vos services.
      </p>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-muted-foreground self-center shrink-0" />
        {SERVICES.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
              filter === s.key ? "gradient-primary text-white shadow-card" : "bg-muted text-muted-foreground"
            }`}
          >
            {s.label} {counts[s.key] > 0 && <span className="opacity-80">({counts[s.key]})</span>}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl shadow-card p-4 animate-pulse h-24" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm font-semibold text-muted-foreground">Aucune mission libre disponible</p>
          <p className="text-[11px] text-muted-foreground/70 mt-1">Revenez plus tard, de nouvelles annonces arrivent en continu.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m: any, i: number) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card rounded-2xl shadow-card overflow-hidden border border-border/50"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center overflow-hidden shrink-0">
                      {m.dogs?.photo_url ? (
                        <img src={m.dogs.photo_url} alt={m.dogs.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-base">🐕</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{m.dogs?.name || "Animal"}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">
                        {m.dogs?.breed || "Race inconnue"} • {m.service_type || "Prestation"}
                      </p>
                    </div>
                  </div>
                  {m.price && (
                    <span className="text-sm font-black text-primary shrink-0">{m.price}€</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground bg-muted/50 rounded-xl px-3 py-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {m.scheduled_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {m.scheduled_time}
                  </span>
                  {m.duration_minutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {m.duration_minutes}min
                    </span>
                  )}
                  {m.city && (
                    <span className="flex items-center gap-1 ml-auto">
                      <MapPin className="w-3 h-3" /> {m.city}
                    </span>
                  )}
                </div>

                {m.notes && (
                  <p className="text-xs text-muted-foreground bg-muted/30 rounded-xl px-3 py-2 mt-2 italic">
                    "{m.notes}"
                  </p>
                )}

                <button
                  onClick={() => handlePostuler(m)}
                  disabled={submittingId === m.id}
                  className="mt-3 w-full py-2 rounded-xl gradient-primary text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submittingId === m.id ? "Envoi…" : "Postuler à cette mission"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreeMissionsTab;
