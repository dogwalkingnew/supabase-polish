/**
 * DogWalking — Confiance canine de proximité : liste de profils issue de Supabase,
 * sans disponibilité, délai, carte, favori ou prix artificiel lorsqu’une donnée manque.
 */
import { useState } from "react";
import { Star, MapPin, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useNearbyWalkers } from "@/hooks/useNearbyWalkers";

const sortOptions = ["Pertinence", "Prix ↑", "Prix ↓", "Note"] as const;

const CardSkeleton = () => (
  <div className="bg-card rounded-xl border border-border p-4 animate-pulse">
    <div className="flex gap-4">
      <div className="w-[72px] h-[72px] rounded-xl bg-muted" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="h-5 bg-muted rounded-full w-20" />
        <div className="h-8 bg-muted rounded-lg w-28" />
      </div>
    </div>
  </div>
);

const AccompagnateurCertifiesListe = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Pertinence");
  const { data: rawWalkers, isLoading } = useNearbyWalkers();

  const walkers = (rawWalkers || []).map((walker: any) => ({
    id: walker.user_id as string,
    name: `${walker.profiles?.first_name || "Accompagnateur"} ${(walker.profiles?.last_name || "")[0] || ""}.`,
    rating: Number(walker.rating) || 0,
    reviews: Number(walker.total_reviews) || 0,
    price: walker.hourly_rate ?? null,
    location: walker.profiles?.city || null,
    bio: walker.bio || "Profil en cours de complétion",
    verified: Boolean(walker.verified),
    avatar: walker.profiles?.avatar_url as string | undefined,
  }));

  const sorted = [...walkers].sort((a, b) => {
    if (sort === "Prix ↑") return (a.price ?? Infinity) - (b.price ?? Infinity);
    if (sort === "Prix ↓") return (b.price ?? -Infinity) - (a.price ?? -Infinity);
    if (sort === "Note") return b.rating - a.rating;
    return 0;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-extrabold text-foreground">Accompagnateurs</h2>
          <p className="text-sm text-foreground/70 font-medium">
            <span className="font-bold text-primary">{sorted.length}</span> profil{sorted.length > 1 ? "s" : ""} trouvé{sorted.length > 1 ? "s" : ""}
          </p>
        </div>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as (typeof sortOptions)[number])}
          className="text-xs border border-border rounded-lg px-3 py-2 bg-card text-foreground font-semibold focus:border-primary focus:outline-none"
        >
          {sortOptions.map((option) => <option key={option} value={option}>Trier : {option}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((item) => <CardSkeleton key={item} />)}</div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-12 bg-warm/60 rounded-[1.25rem] border border-primary/15 shadow-soft">
          <p className="text-lg font-bold text-foreground mb-2">Aucun accompagnateur pour le moment</p>
          <p className="text-sm text-foreground/60">Revenez bientôt pour consulter les nouveaux profils.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((walker, index) => (
            <motion.div
              key={walker.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => navigate(`/walker/${walker.id}`)}
              className="bg-card/95 rounded-[1.25rem] border border-primary/10 p-4 group relative cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card hover:border-primary/30"
            >
              <div className="flex gap-4">
                <div className="shrink-0">
                  {walker.avatar ? (
                    <img src={walker.avatar} alt={walker.name} className="w-[72px] h-[72px] rounded-xl object-cover border-2 border-border" />
                  ) : (
                    <div className="rounded-xl bg-muted flex items-center justify-center text-3xl border-2 border-border group-hover:border-primary/30 transition-colors w-[72px] h-[72px]">
                      {walker.name.charAt(0)}
                    </div>
                  )}
                  {walker.verified && (
                    <div className="flex items-center justify-center -mt-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        <Shield className="h-3 w-3" /> Profil vérifié
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-foreground text-sm group-hover:text-primary transition-colors mb-1">{walker.name}</h3>
                  {walker.rating > 0 && walker.reviews > 0 && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, ratingIndex) => (
                          <Star key={ratingIndex} className={cn("h-3 w-3", ratingIndex < Math.floor(walker.rating) ? "fill-[hsl(var(--star))] text-[hsl(var(--star))]" : "text-border")} />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-foreground">{walker.rating.toFixed(1)}</span>
                      <span className="text-xs text-foreground/50">({walker.reviews} avis)</span>
                    </div>
                  )}
                  {walker.location && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-foreground/70 mb-2">
                      <MapPin className="h-3 w-3" /> {walker.location}
                    </span>
                  )}
                  <p className="text-xs text-foreground/60 mb-3 line-clamp-1 font-medium">{walker.bio}</p>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      {walker.price !== null ? <>
                        <span className="text-lg font-extrabold text-primary">{walker.price}€</span>
                        <span className="text-xs text-foreground/50 ml-1">/heure</span>
                      </> : <span className="text-xs text-foreground/50">Tarif non renseigné</span>}
                    </div>
                    <button
                      onClick={(event) => { event.stopPropagation(); navigate(`/walker/${walker.id}`); }}
                      className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-all active:scale-95"
                    >
                      Voir le profil
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccompagnateurCertifiesListe;
