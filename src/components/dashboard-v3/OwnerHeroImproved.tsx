import { Cloud, CloudRain, Sun, Wind, Droplets, HelpCircle } from "lucide-react";
import { useWeatherImages } from "@/hooks/useWeatherImages";
import { motion } from "framer-motion";

interface OwnerHeroImprovedProps {
  temperature?: number;
  condition?: string;
  helpText?: string;
  alt?: string;
  latitude?: number;
  longitude?: number;
}

const OwnerHeroImproved = ({
  temperature,
  condition,
  helpText = "Besoin d'aide ?",
  alt = "Propriétaire avec son chien",
  latitude,
  longitude,
}: OwnerHeroImprovedProps) => {
  const weather = useWeatherImages(latitude, longitude);

  // Utiliser les données météo si pas de props spécifiées
  const temp = temperature ?? weather.temperature;
  const cond = condition ?? weather.conditionLabel;
  const imageUrl = weather.imageUrl;
  const humidity = weather.humidity;
  const windSpeed = weather.windSpeed;

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <Sun className="w-8 h-8 stroke-[1.5]" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 stroke-[1.5]" />;
      case 'snowy':
        return <Cloud className="w-8 h-8 stroke-[1.5]" />;
      case 'windy':
        return <Wind className="w-8 h-8 stroke-[1.5]" />;
      default:
        return <Cloud className="w-8 h-8 stroke-[1.5]" />;
    }
  };

  return (
    <header className="relative w-full overflow-hidden">
      {/* Bandeau ~3x la hauteur du bouton Réserver (72px) */}
      <div className="relative w-full h-[220px] sm:h-[240px]">
        {/* Image dynamique avec fallback */}
        <motion.img
          key={imageUrl}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={imageUrl}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          width={1600}
          height={480}
          loading="eager"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1633722715463-d30628cbc4c1?w=1600&h=480&fit=crop';
          }}
        />

        {/* Dégradé émeraude depuis la droite */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#1E7B5F]/95 via-[#10B981]/55 to-transparent" />

        {/* Voile bas pour fondre dans le contenu */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#F9F7F4] to-transparent" />

        {/* Badge PROPRIÉTAIRE */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 left-4 inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[#1E7B5F] px-3 py-1.5 rounded-full shadow-sm ring-1 ring-[#10B981]/20"
        >
          <span className="w-5 h-5 rounded-full bg-[#10B981]/15 flex items-center justify-center text-[10px]">🐕</span>
          <span className="text-[11px] font-bold tracking-[0.18em]">PROPRIÉTAIRE</span>
        </motion.div>

        {/* Météo + aide compacts */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 right-4 text-white text-right max-w-[240px]"
        >
          <div className="flex items-start justify-end gap-2.5">
            {getWeatherIcon()}
            <div>
              <div className="text-4xl font-light leading-none tracking-tight">
                {temp}°<span className="text-2xl align-top">C</span>
              </div>
              <div className="text-sm font-light mt-0.5 opacity-95">{cond}</div>
            </div>
          </div>

          {/* Ligne séparatrice */}
          <div className="w-24 h-px bg-[#D4A574] ml-auto mt-2.5 mb-1.5" />

          {/* Détails météo secondaires */}
          <div className="flex items-center justify-end gap-3 text-[11px] font-light opacity-90 mb-2">
            <div className="flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              <span>{humidity}%</span>
            </div>
            <div className="w-px h-3 bg-white/30" />
            <div className="flex items-center gap-1">
              <Wind className="w-3 h-3" />
              <span>{windSpeed} km/h</span>
            </div>
          </div>

          {/* Aide */}
          <button className="flex items-center justify-end gap-1.5 text-[12px] font-light leading-snug ml-auto hover:opacity-80 transition-opacity">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{helpText}</span>
          </button>
        </motion.div>

        {/* Indicateur de localisation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-4 left-4 text-white text-[12px] font-light opacity-80"
        >
          📍 {weather.city}
        </motion.div>
      </div>
    </header>
  );
};

export default OwnerHeroImproved;
