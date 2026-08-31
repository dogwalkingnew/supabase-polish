/** DogWalking — tableau Propriétaire factuel : animaux et missions réelles, sans suivi, santé ou urgence simulés. */
/* Direction visuelle : project-gem, interface émeraude/sable, mobile-first ; le desktop respire avec une largeur maîtrisée et des surfaces lisibles. */
import { CalendarDays, MapPin, User2, Clock, Euro, ArrowRight } from "lucide-react";
import OwnerHeroImproved from "./OwnerHeroImproved";
import GoButton from "./GoButton";
import SectionTitle from "./SectionTitle";

interface Pet {
  id: string;
  name: string;
  breed: string;
  photo: string;
  ageYears?: number;
  weightKg?: number;
}

interface NextMission {
  id: string;
  date: string;
  time: string;
  address: string;
  city: string;
  walkerName: string;
  walkerPhoto?: string;
  walkerRole: string;
  status: "Confirmée" | "En attente";
  estimatedDuration?: number;
  indicativePrice?: number;
}

interface OwnerHomeImprovedProps {
  pets: Pet[];
  nextMission?: NextMission | null;
  onReserve?: () => void;
  onViewAllPets?: () => void;
  onViewAllMissions?: () => void;
  onViewMissionDetails?: () => void;
}

const OwnerHomeImproved = ({ pets, nextMission, onReserve, onViewAllPets, onViewAllMissions, onViewMissionDetails }: OwnerHomeImprovedProps) => (
  <div className="bg-[#F9F7F4] min-h-dvh pb-28">
    <OwnerHeroImproved alt="Propriétaire avec son chien" />
    <main className="mx-auto -mt-3 w-full max-w-7xl space-y-6 px-4 sm:px-6 lg:px-10">
      <div className="pt-2">
        <GoButton label="Consulter les Accompagnateurs" onClick={onReserve} />
      </div>

      <section>
        <SectionTitle title="Mes animaux" actionLabel={pets.length > 0 ? "Gérer" : "Ajouter"} onAction={onViewAllPets} />
        {pets.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-[#5C5C70] shadow-[0_2px_10px_rgba(26,26,46,0.06)]">
            Ajoutez un animal avant de formuler une demande ; chaque mission reste rattachée au profil concerné.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {pets.slice(0, 2).map((pet) => (
              <article key={pet.id} className="overflow-hidden rounded-2xl bg-white p-2.5 shadow-[0_2px_10px_rgba(26,26,46,0.06)]">
                <img src={pet.photo} alt={pet.name} className="h-24 w-full rounded-xl object-cover" loading="lazy" />
                <div className="px-1 pt-2">
                  <h2 className="truncate font-bold text-[#1A1A2E]">{pet.name}</h2>
                  <p className="truncate text-xs text-[#8A8A99]">{pet.breed}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {nextMission && (
        <section>
          <SectionTitle title="Prochaine demande" actionLabel="Voir toutes" onAction={onViewAllMissions} />
          <article className="rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(26,26,46,0.06)]">
            <div className="flex gap-3">
              {nextMission.walkerPhoto ? (
                <img src={nextMission.walkerPhoto} alt={nextMission.walkerName} className="h-14 w-14 rounded-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1E7B5F]/10 text-lg font-bold text-[#1E7B5F]" aria-hidden="true">
                  {nextMission.walkerName.slice(0, 1)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-bold text-[#1A1A2E]">{nextMission.walkerName}</p>
                  <span className="shrink-0 rounded-full bg-[#1E7B5F]/10 px-2 py-0.5 text-[10px] font-bold text-[#1E7B5F]">{nextMission.status}</span>
                </div>
                <p className="mt-0.5 text-xs text-[#8A8A99]">{nextMission.walkerRole}</p>
                <div className="mt-3 space-y-1.5 text-xs text-[#5C5C70]">
                  <p className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-[#1E7B5F]" />{nextMission.date} · {nextMission.time || "heure à confirmer"}</p>
                  {nextMission.address && <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-[#1E7B5F]" />{nextMission.address}{nextMission.city ? `, ${nextMission.city}` : ""}</p>}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
                    {nextMission.estimatedDuration && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{nextMission.estimatedDuration} min</span>}
                    {nextMission.indicativePrice !== undefined && <span className="flex items-center gap-1"><Euro className="h-3.5 w-3.5" />{nextMission.indicativePrice} € indicatifs</span>}
                  </div>
                </div>
              </div>
            </div>
            <button type="button" onClick={onViewMissionDetails} aria-label={`Suivre la demande de ${nextMission.walkerName}`} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#1E7B5F]/30 px-3 py-2.5 text-sm font-bold text-[#1E7B5F] transition-colors hover:bg-[#1E7B5F]/5">
              Suivre la demande <ArrowRight className="h-4 w-4" />
            </button>
          </article>
        </section>
      )}
    </main>
  </div>
);

export default OwnerHomeImproved;
