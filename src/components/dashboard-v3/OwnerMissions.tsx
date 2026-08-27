/** DogWalking — missions Propriétaire : profils et historique issus des données réelles, sans disponibilité ou réservation simulée. */
import { Search, Star, ArrowRight, CalendarDays, Euro } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Walker {
  id: string;
  name: string;
  photo?: string;
  rating: number;
  reviews: number;
  services: string[];
  pricePerHour?: number;
}

export interface PastMission {
  id: string;
  title: string;
  walkerName: string;
  date: string;
  price?: number;
  status: "Terminée" | "Annulée";
}

interface OwnerMissionsProps {
  profiles: Walker[];
  history: PastMission[];
}

const OwnerMissions = ({ profiles, history }: OwnerMissionsProps) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const query = search.trim().toLowerCase();
  const matchingProfiles = profiles.filter((walker) => !query || walker.name.toLowerCase().includes(query) || walker.services.some((service) => service.toLowerCase().includes(query)));

  return (
    <div className="space-y-7 bg-[#FDFDFB] p-4 pb-8">
      <section>
        <label className="relative block" htmlFor="owner-walker-search">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1DB584]" />
          <input id="owner-walker-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un Accompagnateur ou un service" className="w-full rounded-2xl border border-[#E9E5DD] bg-white py-3.5 pl-11 pr-4 text-sm text-[#1A1A2E] shadow-sm outline-none focus:border-[#1DB584] focus:ring-2 focus:ring-[#1DB584]/20" />
        </label>
      </section>

      <section>
        <h1 className="mb-3 text-base font-extrabold text-[#1E7B5F]">Profils Accompagnateur renseignés</h1>
        {matchingProfiles.length === 0 ? (
          <p className="rounded-2xl bg-white p-5 text-sm text-[#5C5C70] shadow-sm">Aucun profil ne correspond à cette recherche. Vous pouvez modifier les termes saisis ou consulter les annonces ouvertes.</p>
        ) : (
          <div className="space-y-3">
            {matchingProfiles.map((walker) => (
              <article key={walker.id} className="flex items-center gap-3 rounded-2xl border border-[#EDE9E0] bg-white p-3.5 shadow-sm">
                {walker.photo ? <img src={walker.photo} alt={walker.name} className="h-14 w-14 rounded-xl object-cover" loading="lazy" /> : <div aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1E7B5F]/10 font-bold text-[#1E7B5F]">{walker.name.slice(0, 1)}</div>}
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-extrabold text-[#1A1A2E]">{walker.name}</h2>
                  {walker.reviews > 0 && walker.rating > 0 && <p className="mt-0.5 flex items-center gap-1 text-xs text-[#8B6B3A]"><Star className="h-3.5 w-3.5 fill-current" />{walker.rating.toFixed(1)} · {walker.reviews} avis</p>}
                  {walker.services.length > 0 && <p className="mt-1 truncate text-xs text-[#5C5C70]">{walker.services.join(" · ")}</p>}
                  {walker.pricePerHour !== undefined && <p className="mt-1 text-xs font-semibold text-[#1E7B5F]">{walker.pricePerHour} € / heure indicatifs</p>}
                </div>
                <button type="button" onClick={() => navigate(`/walker/${walker.id}`)} className="shrink-0 rounded-lg border border-[#1E7B5F]/30 p-2 text-[#1E7B5F] transition-colors hover:bg-[#1E7B5F]/5" aria-label={`Voir le profil de ${walker.name}`}><ArrowRight className="h-4 w-4" /></button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-base font-extrabold text-[#1E7B5F]">Historique des missions</h2>
        {history.length === 0 ? <p className="rounded-2xl bg-white p-5 text-sm text-[#5C5C70] shadow-sm">Aucune mission terminée ou annulée n’est enregistrée.</p> : <div className="space-y-3">{history.map((mission) => <article key={mission.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[#EDE9E0] bg-white p-3.5 shadow-sm"><div className="min-w-0"><h3 className="truncate text-sm font-bold text-[#1A1A2E]">{mission.title}</h3><p className="mt-1 flex items-center gap-1 text-xs text-[#5C5C70]"><CalendarDays className="h-3.5 w-3.5" />{mission.date}</p><p className="mt-1 text-xs text-[#5C5C70]">Avec {mission.walkerName}</p></div><div className="shrink-0 text-right"><span className="rounded-full bg-[#1E7B5F]/10 px-2 py-0.5 text-[10px] font-bold text-[#1E7B5F]">{mission.status}</span>{mission.price !== undefined && <p className="mt-2 flex items-center justify-end gap-0.5 text-xs text-[#5C5C70]"><Euro className="h-3.5 w-3.5" />{mission.price} € indicatifs</p>}</div></article>)}</div>}
      </section>
    </div>
  );
};

export default OwnerMissions;
