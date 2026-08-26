import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
/**
 * DogWalking — Confiance canine de proximité : recherche et demande rapide sans paiement simulé,
 * avec publication reliée à une réservation valide dans Supabase.
 */
import { MapPin, Search, Heart, ChevronDown, PenLine, Calendar, Clock, Sparkles, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Mode = "search" | "annonce";

const servicesAbsent = [
  { id: "garde", label: "Hébergement ou garde" },
];
const servicesTravail = [
  { id: "visite", label: "Visites à votre domicile" },
  { id: "promenade", label: "Promenade" },
  { id: "veterinaire", label: "Accompagnement vétérinaire" },
];
const allServices = [...servicesAbsent, ...servicesTravail];

const SmartSearchForm = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("search");

  // Champs communs
  const [animal, setAnimal] = useState<"chien" | "chat">("chien");
  const [service, setService] = useState("garde");
  const [address, setAddress] = useState("");
  const [servicesOpen, setServicesOpen] = useState(false);

  // Annonce libre
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState(60);
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(20);

  const selectedLabel = allServices.find((s) => s.id === service)?.label ?? "Choisir";

  const handleSearch = () => {
    document.getElementById("recherche")?.scrollIntoView({ behavior: "smooth" });
  };

  const goAnnonceStep = (n: number) => {
    if (n === 2 && !address.trim()) {
      toast({ title: "Adresse requise", description: "Indiquez votre localisation pour continuer." });
      return;
    }
    if (n === 3 && !date) {
      toast({ title: "Date requise", description: "Choisissez une date pour votre besoin." });
      return;
    }
    setStep(n);
  };

  const publishAnnonce = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        sessionStorage.setItem("pendingFreeAd", JSON.stringify({
          animal, service, address, date, time, duration, description, budget,
        }));
        toast({ title: "Connexion requise", description: "Connectez-vous pour finaliser." });
        navigate(`/auth?redirect=${encodeURIComponent("/walkers")}`);
        return;
      }

      const { data: dogs } = await supabase
        .from("dogs")
        .select("id")
        .eq("owner_id", session.user.id)
        .limit(1);

      if (!dogs || dogs.length === 0) {
        toast({ title: "Ajoutez un animal", description: "Ajoutez votre animal avant de publier." });
        navigate("/dashboard?tab=chiens");
        return;
      }

      const { error } = await (supabase as any).from("bookings").insert({
        owner_id: session.user.id,
        walker_id: null,
        dog_id: dogs[0].id,
        scheduled_date: date,
        scheduled_time: time,
        duration_minutes: duration,
        service_type: service,
        price: budget,
        notes: description || null,
        address: address || null,
        status: "pending",
      });
      if (error) throw error;

      toast({ title: "Annonce publiée ✓", description: "Votre demande est maintenant enregistrée." });
      setStep(1);
      setDescription("");
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message || "Publication impossible.", variant: "destructive" });
    }
  };

  // ---------- UI parts ----------
  const AnimalServiceLocation = (
    <div className="grid md:grid-cols-3 gap-3">
      {/* Animal */}
      <div>
        <p className="text-[11px] font-bold text-foreground/70 mb-1.5 uppercase tracking-wide">Animal</p>
        <div className="flex gap-2 border border-border rounded-xl bg-background px-3 py-2.5">
          {(["chien", "chat"] as const).map((a) => (
            <button key={a} onClick={() => setAnimal(a)}
              className={cn("flex-1 flex items-center justify-center gap-1.5 py-1 rounded-lg text-sm font-bold transition-all",
                animal === a ? "bg-primary/10 text-primary" : "text-foreground/60 hover:bg-secondary"
              )}>
              {a === "chien" ? "🐶 Chien" : "🐱 Chat"}
            </button>
          ))}
        </div>
      </div>

      {/* Service */}
      <div className="relative">
        <p className="text-[11px] font-bold text-foreground/70 mb-1.5 uppercase tracking-wide">Service</p>
        <Collapsible open={servicesOpen} onOpenChange={setServicesOpen}>
          <CollapsibleTrigger className="w-full flex items-center gap-2 justify-between rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors">
            <span className="flex items-center gap-2 truncate">
              <Heart className="h-3.5 w-3.5 text-destructive fill-destructive shrink-0" />
              <span className="truncate">{selectedLabel}</span>
            </span>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform shrink-0", servicesOpen && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="absolute left-0 right-0 top-full mt-1 z-20 bg-card border border-border rounded-xl shadow-lg p-3">
            <p className="text-[10px] font-bold text-muted-foreground mb-1.5 uppercase">Absent</p>
            <div className="space-y-0.5 mb-2">
              {servicesAbsent.map((s) => (
                <button key={s.id} onClick={() => { setService(s.id); setServicesOpen(false); }}
                  className={cn("w-full text-left px-2.5 py-2 rounded-lg text-sm transition-all",
                    service === s.id ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-secondary"
                  )}>{s.label}</button>
              ))}
            </div>
            <p className="text-[10px] font-bold text-muted-foreground mb-1.5 uppercase">Au travail</p>
            <div className="space-y-0.5">
              {servicesTravail.map((s) => (
                <button key={s.id} onClick={() => { setService(s.id); setServicesOpen(false); }}
                  className={cn("w-full text-left px-2.5 py-2 rounded-lg text-sm transition-all",
                    service === s.id ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-secondary"
                  )}>{s.label}</button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Adresse */}
      <div>
        <p className="text-[11px] font-bold text-foreground/70 mb-1.5 uppercase tracking-wide">Où</p>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
          <input value={address} onChange={(e) => setAddress(e.target.value)}
            placeholder="Votre ville ou zone"
            className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2.5 text-sm font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all placeholder:text-muted-foreground/60" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-2xl border border-border shadow-2xl overflow-hidden">
      {/* Onglets */}
      <div className="flex border-b border-border bg-secondary/30">
        {[
          { id: "search", label: "Recherche express", icon: Search },
          { id: "annonce", label: "Annonce libre", icon: PenLine },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => { setMode(t.id as Mode); setStep(1); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all relative",
              mode === t.id ? "text-primary bg-card" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            {mode === t.id && (
              <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="p-5 md:p-6">
        <AnimatePresence mode="wait">
          {/* ============ MODE RECHERCHE ============ */}
          {mode === "search" && (
            <motion.div key="search" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {AnimalServiceLocation}
              <div className="mt-4 flex justify-end">
                <button onClick={handleSearch}
                  className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                  <Search className="h-5 w-5" /> Rechercher
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground text-center mt-3 font-medium">
                Pas le bon profil ? Bascule sur <button onClick={() => setMode("annonce")} className="text-primary font-bold hover:underline">Annonce libre</button> pour recevoir des propositions.
              </p>
            </motion.div>
          )}

          {/* ============ MODE ANNONCE LIBRE ============ */}
          {mode === "annonce" && (
            <motion.div key="annonce" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {/* Stepper */}
              <div className="flex items-center gap-2 mb-5">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-2 flex-1">
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold border-2 transition-all shrink-0",
                      step === n ? "bg-primary text-primary-foreground border-primary" :
                      step > n ? "bg-primary/15 text-primary border-primary/40" :
                      "bg-background text-muted-foreground border-border"
                    )}>
                      {step > n ? <Check className="h-3.5 w-3.5" /> : n}
                    </div>
                    {n < 3 && <div className={cn("flex-1 h-0.5 rounded-full", step > n ? "bg-primary/40" : "bg-border")} />}
                  </div>
                ))}
              </div>

              {/* Step 1 : besoin */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-foreground mb-1">Votre besoin</h3>
                    <p className="text-xs text-muted-foreground">Qui, quel service, où.</p>
                  </div>
                  {AnimalServiceLocation}
                  <div className="flex justify-end">
                    <Button onClick={() => goAnnonceStep(2)} className="gap-2 font-bold">
                      Continuer <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2 : détails */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-foreground mb-1">Quand & combien</h3>
                    <p className="text-xs text-muted-foreground">Précisez la date, durée et votre budget.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-[11px] font-bold text-foreground/70 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Date
                      </p>
                      <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-semibold focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-foreground/70 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Heure
                      </p>
                      <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-semibold focus:border-primary focus:outline-none" />
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-foreground/70 mb-1.5 uppercase tracking-wide">Durée</p>
                    <div className="flex gap-2 flex-wrap">
                      {[30, 60, 120, 240, 480].map((d) => (
                        <button key={d} onClick={() => setDuration(d)}
                          className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                            duration === d ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground/70 hover:border-primary/40"
                          )}>{d < 60 ? `${d}min` : `${d / 60}h`}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-foreground/70 mb-1.5 uppercase tracking-wide">Budget proposé</p>
                    <div className="flex items-center gap-3">
                      <input type="range" min={10} max={100} step={5} value={budget} onChange={(e) => setBudget(Number(e.target.value))}
                        className="flex-1 accent-primary" />
                      <span className="font-extrabold text-primary text-lg w-16 text-right">{budget}€</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-foreground/70 mb-1.5 uppercase tracking-wide">Description (optionnel)</p>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                      maxLength={300} rows={2} placeholder="Caractère de l'animal, contraintes, etc."
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none resize-none" />
                  </div>

                  <div className="flex justify-between gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                      <ArrowLeft className="h-4 w-4" /> Retour
                    </Button>
                    <Button onClick={() => goAnnonceStep(3)} className="gap-2 font-bold">
                      Récapitulatif <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3 : récapitulatif */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-foreground mb-1 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-primary" /> Récapitulatif
                    </h3>
                    <p className="text-xs text-muted-foreground">Vérifiez puis publiez votre annonce.</p>
                  </div>

                  <div className="bg-secondary/40 rounded-xl border border-border p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Animal</span><span className="font-bold">{animal === "chien" ? "🐶 Chien" : "🐱 Chat"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-bold">{selectedLabel}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Où</span><span className="font-bold truncate max-w-[60%]">{address || "—"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Quand</span><span className="font-bold">{date || "—"} · {time}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Durée</span><span className="font-bold">{duration < 60 ? `${duration}min` : `${duration / 60}h`}</span></div>
                    <div className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="font-bold">Prix indicatif</span>
                      <span className="font-extrabold text-primary text-base">{budget}€</span>
                    </div>
                  </div>

                  <div className="flex justify-between gap-3">
                    <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                      <ArrowLeft className="h-4 w-4" /> Modifier
                    </Button>
                    <Button onClick={publishAnnonce} className="gap-2 font-bold">
                      <Check className="h-4 w-4" /> Publier l’annonce
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default SmartSearchForm;
