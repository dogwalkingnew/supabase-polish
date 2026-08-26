import React from "react";

interface OwnerHeroProps {
  image: string;
  temperature?: number;
  condition?: string;
  userName?: string;
  alt: string;
}

const OwnerHero = ({
  image,
  temperature = 17,
  condition = "Nuageux",
  userName = "Jean",
  alt,
}: OwnerHeroProps) => {
  return (
    <header className="relative w-full overflow-visible">
      {/* Bandeau réduit à 150px avec image réelle */}
      <div 
        className="relative w-full h-[150px] bg-cover bg-center flex items-center justify-between px-6"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('${image}')` 
        }}
      >
        <div className="flex items-center gap-4 z-10">
          {/* Cercle de Profil à gauche */}
          <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden shadow-lg bg-white shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-white">
            <h2 className="text-lg font-extrabold leading-tight">Bonjour, {userName} 👋</h2>
            <p className="text-[10px] opacity-90 font-medium">📍 Paris, France</p>
          </div>
        </div>

        <div className="text-right text-white z-10">
          <div className="text-2xl font-light">{temperature}°C</div>
          <div className="text-[10px] font-bold uppercase tracking-wider">☁️ {condition}</div>
        </div>
      </div>

      {/* Bouton Réserver Principal (Positionné stratégiquement) */}
      <div className="px-6 -mt-6 relative z-30">
        <button className="w-full bg-[#1DB584] text-white py-4 rounded-2xl font-extrabold text-sm shadow-xl shadow-[#1DB584]/20 flex items-center justify-center relative active:scale-[0.98] transition-all">
          RÉSERVER UN SERVICE
          <div className="absolute right-2 w-10 h-10 bg-[#D4A574] rounded-full flex items-center justify-center text-[10px] font-black text-white">
            GO
          </div>
        </button>
      </div>
    </header>
  );
};

export default OwnerHero;
