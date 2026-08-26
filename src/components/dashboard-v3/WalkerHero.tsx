import { Cloud } from "lucide-react";

interface WalkerHeroProps {
  image: string;
  temperature?: number;
  condition?: string;
  helpText?: string;
  alt: string;
  online?: boolean;
  onToggleOnline?: () => void;
}

const WalkerHero = ({ image, temperature = 17, condition = "Nuageux", helpText = "Bonne journée pour les promenades", alt, online = true, onToggleOnline }: WalkerHeroProps) => {
  return (
    <header className="relative w-full overflow-hidden bg-[#0E1428]">
      <div className="relative aspect-[16/11] w-full">
        <img src={image} alt={alt} className="absolute inset-0 w-full h-full object-cover" width={1280} height={896} />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0E1428] via-[#0E1428]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E1428]" />

        {/* Role badge */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-[#10B981] text-white px-3.5 py-1.5 rounded-full shadow-md">
          <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-[10px]">🐾</span>
          <span className="text-[11px] font-bold tracking-[0.18em]">ACCOMPAGNATEUR</span>
        </div>

        {/* Online toggle */}
        <button onClick={onToggleOnline}
          className={`absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide backdrop-blur ${online ? "bg-[#27AE60]/90 text-white" : "bg-white/15 text-white/80"}`}>
          <span className={`w-2 h-2 rounded-full ${online ? "bg-white animate-pulse" : "bg-white/60"}`} />
          {online ? "EN LIGNE" : "HORS LIGNE"}
        </button>

        {/* Weather block */}
        <div className="absolute top-16 right-4 sm:right-8 text-white text-right">
          <div className="flex items-start justify-end gap-3">
            <Cloud className="w-9 h-9 stroke-[1.5]" />
            <div>
              <div className="text-4xl font-light leading-none tracking-tight">{temperature}°<span className="text-2xl align-top">C</span></div>
              <div className="text-sm font-light mt-1 opacity-90">{condition}</div>
            </div>
          </div>
          <div className="w-24 h-px bg-[#D4A574] ml-auto mt-3 mb-2" />
          <p className="text-xs font-light leading-snug max-w-[200px] ml-auto opacity-90">{helpText}</p>
        </div>
      </div>
    </header>
  );
};

export default WalkerHero;
