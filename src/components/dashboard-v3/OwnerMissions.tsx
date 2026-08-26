import { useState } from "react";
import { Search, SlidersHorizontal, Heart, Star, MapPin, ChevronDown, Calendar, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Walker { id: string; name: string; photo: string; rating: number; reviews: number; services: string[]; distanceKm: number; pricePerHour: number; favorite?: boolean; }
export interface PastMission { id: string; title: string; walkerName: string; walkerPhoto?: string; date: string; price: number; status: "Terminée" | "Annulée"; }

interface OwnerMissionsProps {
  favorites: Walker[];
  available: Walker[];
  history: PastMission[];
}

const OwnerMissions = ({ favorites, available, history }: OwnerMissionsProps) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const q = search.trim().toLowerCase();
  const matches = (w: Walker) =>
    !q || w.name.toLowerCase().includes(q) || w.services.some((s) => s.toLowerCase().includes(q));
  const filteredFavorites = favorites.filter(matches);
  const filteredAvailable = available.filter(matches);

  return (
    <div className="space-y-6 p-4 bg-[#FDFDFB]">
      {/* Moteur de Recherche Premium */}
      <section>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-gray-400 w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Chercher un accompagnateur..."
            className="w-full bg-white border border-gray-100 py-4 pl-12 pr-12 rounded-2xl text-xs font-medium shadow-sm focus:ring-2 focus:ring-[#1DB584]/20 focus:border-[#1DB584] outline-none transition-all"
          />
          <div className="absolute inset-y-0 right-4 flex items-center">
            <SlidersHorizontal className="text-[#1DB584] w-4 h-4 cursor-pointer" />
          </div>
        </div>
      </section>

      {/* Mes Favoris (Priorité d'utilisation) */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-extrabold text-[#1DB584]">Mes Favoris</h3>
          <button className="text-[10px] font-bold text-[#D4A574] hover:underline">Voir tout</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {filteredFavorites.map((walker) => (
            <div key={walker.id} onClick={() => navigate(`/walker/${walker.id}`)} className="shrink-0 w-[200px] bg-white border border-gray-100 p-3 rounded-2xl shadow-sm relative group cursor-pointer">
              <button className="absolute top-2 right-2 text-red-500 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm z-10">
                <Heart size={14} fill="currentColor" />
              </button>
              <img src={walker.photo} className="w-full h-24 rounded-xl object-cover mb-3 group-hover:opacity-90 transition-opacity" alt={walker.name} />
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-extrabold text-gray-800">{walker.name}</p>
                  <div className="flex items-center gap-0.5 text-[#D4A574]">
                    <Star size={10} fill="currentColor" />
                    <span className="text-[10px] font-bold">{walker.rating}</span>
                  </div>
                </div>
                <p className="text-[9px] text-gray-500 font-medium truncate">{walker.services.join(" • ")}</p>
                <div className="flex justify-between items-center pt-1">
                  <p className="text-[9px] text-gray-400 flex items-center gap-1"><MapPin size={10} /> {walker.distanceKm} km</p>
                  <p className="text-[10px] font-black text-[#1DB584]">{walker.pricePerHour}€/h</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accompagnateurs Disponibles */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-extrabold text-[#1DB584]">Accompagnateurs Disponibles</h3>
          <div className="flex gap-2">
            <button className="text-[9px] font-bold bg-white border border-gray-100 px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">Service <ChevronDown size={10}/></button>
            <button className="text-[9px] font-bold bg-white border border-gray-100 px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">Distance <ChevronDown size={10}/></button>
          </div>
        </div>
        <div className="space-y-4">
          {filteredAvailable.map((walker) => (
            <div key={walker.id} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex gap-4 items-center group cursor-pointer hover:border-[#1DB584]/30 transition-all">
              <img src={walker.photo} className="w-16 h-16 rounded-xl object-cover border border-gray-100" alt={walker.name} />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-extrabold text-gray-800">{walker.name}</p>
                  <p className="text-[10px] font-black text-[#1DB584]">{walker.pricePerHour}€/h</p>
                </div>
                <div className="flex items-center gap-1 text-[#D4A574] my-1">
                  <Star size={10} fill="currentColor" />
                  <span className="text-[10px] font-bold">{walker.rating} <span className="text-gray-400 font-medium">({walker.reviews} avis)</span></span>
                </div>
                <p className="text-[9px] text-gray-500 truncate">{walker.services.join(" • ")} • 📍 {walker.distanceKm} km</p>
              </div>
              <button className="bg-[#1DB584] text-white text-[9px] font-black px-3 py-2 rounded-lg shadow-sm active:scale-95 transition-all">
                RÉSERVER
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Historique des missions */}
      <section className="pb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-extrabold text-[#1DB584]">Historique missions</h3>
          <button className="text-[10px] font-bold text-[#D4A574] hover:underline">Voir tout</button>
        </div>
        {history.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">Aucune mission passée pour le moment.</p>
        )}
        {history.map((h) => (
          <div key={h.id} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex justify-between items-center mb-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-gray-800">{h.title}</p>
                <p className="text-[10px] text-gray-500">Avec {h.walkerName} • {h.date}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-emerald-50 text-[#1DB584] text-[8px] font-extrabold px-2 py-0.5 rounded uppercase mb-1 block">TERMINEE</span>
              <p className="text-xs font-black text-gray-800">{h.price}€</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default OwnerMissions;
