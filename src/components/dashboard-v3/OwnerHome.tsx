import { AlertTriangle, Map, Clock, ArrowRight, Lightbulb, ChevronRight, Heart, Star, MapPin, Calendar, Zap, Shield, CheckCircle2 } from "lucide-react";

interface Pet { 
  id: string; 
  name: string; 
  breed: string; 
  photo: string; 
  ageYears: number; 
  weightKg: number;
  vaccineStatus: "up-to-date" | "warning" | "overdue";
}

interface NextMission {
  date: string; 
  time: string; 
  address: string; 
  city: string;
  walkerName: string; 
  walkerPhoto?: string; 
  walkerRole: string; 
  status: string;
  duration: number;
  price: number;
}

interface OwnerHomeProps {
  pets: Pet[];
  nextMission?: NextMission | null;
  userBalance?: number;
}

const OwnerHome = ({ pets, nextMission, userBalance = 48.50 }: OwnerHomeProps) => {
  return (
    <div className="space-y-6 p-4 bg-[#FDFDFB] pb-24">
      
      {/* 🔴 SECTION CRITIQUE : ALERTES INTELLIGENTES */}
      <section>
        <h3 className="text-base font-extrabold text-[#1DB584] mb-3">À ne pas manquer</h3>
        
        {/* Alerte Vaccin */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex justify-between items-center shadow-sm hover:shadow-md transition-all">
          <div className="flex gap-3 items-center">
            <AlertTriangle className="text-red-500 w-5 h-5 flex-shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-red-700">Vaccin de Max expire bientôt</p>
              <p className="text-[10px] text-red-600">Rage • Expire dans 3 jours</p>
            </div>
          </div>
          <button className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all whitespace-nowrap">
            RÉSERVER
          </button>
        </div>

        {/* Alerte Vermifuge */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl flex justify-between items-center shadow-sm mt-3 hover:shadow-md transition-all">
          <div className="flex gap-3 items-center">
            <Zap className="text-orange-500 w-5 h-5 flex-shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-orange-700">Vermifuge de Luna à jour</p>
              <p className="text-[10px] text-orange-600">Prochain rappel • 15 juin 2024</p>
            </div>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all whitespace-nowrap">
            AJOUTER
          </button>
        </div>
      </section>

      {/* 🔴 SECTION CRITIQUE : SUIVI EN DIRECT */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-extrabold text-[#1DB584]">Suivi en direct</h3>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">En direct</span>
          </div>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
          {/* Carte Interactive */}
          <div className="h-40 bg-gradient-to-br from-blue-50 to-blue-100 relative flex items-center justify-center text-blue-300">
            <Map className="w-16 h-16 opacity-20 absolute" />
            <div className="relative z-10 text-center">
              <p className="text-[11px] font-bold text-blue-600 mb-2">📍 Parc de la Tête d'Or</p>
              <p className="text-[9px] text-blue-500">Promenade en cours • 12 min restantes</p>
            </div>
          </div>

          {/* Détails Promenade */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" 
                className="w-12 h-12 rounded-full object-cover border-2 border-[#1DB584]/20"
                alt="Walker"
              />
              <div className="flex-1">
                <p className="text-xs font-extrabold text-gray-800">Camille D.</p>
                <div className="flex items-center gap-1 text-[#D4A574] mt-0.5">
                  <Star size={10} fill="currentColor" />
                  <span className="text-[9px] font-bold">4.8/5 (127 avis)</span>
                </div>
              </div>
              <button className="text-[#1DB584] text-[10px] font-bold flex items-center gap-1 hover:underline">
                DÉTAILS <ChevronRight size={12} />
              </button>
            </div>

            {/* Barre de Progression */}
            <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#1DB584] h-full w-2/3 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔴 SECTION CRITIQUE : MES COMPAGNONS */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-extrabold text-[#1DB584]">Mes compagnons</h3>
          <button className="text-[10px] font-bold text-[#D4A574] hover:underline">+ AJOUTER</button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {pets.map((pet) => (
            <div key={pet.id} className="bg-white border border-gray-100 p-3 rounded-2xl shadow-sm hover:border-[#1DB584]/30 hover:shadow-md transition-all cursor-pointer group">
              <img src={pet.photo} className="w-full h-24 rounded-xl object-cover mb-2 group-hover:opacity-90 transition-opacity" alt={pet.name} />
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-extrabold text-gray-800">{pet.name}</p>
                    <p className="text-[10px] text-gray-500">{pet.breed}</p>
                  </div>
                  <div className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                    pet.vaccineStatus === 'up-to-date' ? 'bg-emerald-50 text-emerald-600' :
                    pet.vaccineStatus === 'warning' ? 'bg-orange-50 text-orange-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {pet.vaccineStatus === 'up-to-date' ? '✓ À JOUR' : pet.vaccineStatus === 'warning' ? '⚠ BIENTÔT' : '✗ RETARD'}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-gray-500">
                  <Calendar size={10} /> {pet.ageYears} ans • {pet.weightKg}kg
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🟡 SECTION UTILE : PROCHAINE MISSION */}
      {nextMission && (
        <section>
          <h3 className="text-base font-extrabold text-[#1DB584] mb-3">Prochaine mission</h3>
          <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8F8F3] rounded-xl flex items-center justify-center text-[#1DB584]">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-gray-800">{nextMission.date} à {nextMission.time}</p>
                  <p className="text-[10px] text-gray-500">Durée: {nextMission.duration}min • {nextMission.price}€</p>
                </div>
              </div>
              <span className="bg-emerald-50 text-[#1DB584] text-[9px] font-extrabold px-2 py-1 rounded-lg uppercase">{nextMission.status}</span>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
              <img src={nextMission.walkerPhoto || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"} className="w-10 h-10 rounded-full object-cover border border-gray-100" alt="" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-extrabold text-gray-800 truncate">{nextMission.walkerName}</p>
                <p className="text-[9px] text-gray-500 truncate">📍 {nextMission.address}</p>
              </div>
              <button className="bg-[#1DB584] text-white text-[9px] font-black px-3 py-2 rounded-lg shadow-sm active:scale-95 transition-all whitespace-nowrap">
                DÉTAILS
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 🟡 SECTION UTILE : SOLDE DOGGIES */}
      <section>
        <h3 className="text-base font-extrabold text-[#1DB584] mb-3">Mon Portefeuille</h3>
        <div className="bg-gradient-to-br from-[#1DB584] to-[#15925A] p-4 rounded-2xl text-white shadow-lg shadow-[#1DB584]/20">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">Solde Doggies</p>
              <h3 className="text-2xl font-black">{userBalance.toFixed(2)} 🐾</h3>
            </div>
            <button className="bg-white/20 hover:bg-white/30 text-white text-[9px] font-black px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all">
              + AJOUTER
            </button>
          </div>
        </div>
      </section>

      {/* 🟢 SECTION SUPERFLU : CONSEIL DU JOUR */}
      <section>
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#E8F8F3] flex items-center justify-center shrink-0">
            <Lightbulb className="w-6 h-6 text-[#1DB584]" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-gray-800">Conseil du jour</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed mt-1">Après une promenade sous la pluie, séchez bien les pattes de Max pour éviter les irritations cutanées.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default OwnerHome;
