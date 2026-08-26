import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, CloudLightning, CloudFog, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useWeather } from "@/hooks/useWeather";
import type { WeatherCondition } from "@/hooks/useWeather";

const weatherConfig: Record<WeatherCondition, {
  icon: any; label: string; bg: string; text: string; border: string; accent: string;
}> = {
  sunny:   { icon: Sun,             label: "Ensoleillé",  bg: "bg-amber-50/80",  text: "text-amber-700",  border: "border-amber-100",  accent: "text-amber-500" },
  cloudy:  { icon: Cloud,           label: "Nuageux",     bg: "bg-slate-50/80",  text: "text-slate-700",  border: "border-slate-100",  accent: "text-slate-400" },
  rainy:   { icon: CloudRain,       label: "Pluvieux",    bg: "bg-blue-50/80",   text: "text-blue-700",   border: "border-blue-100",   accent: "text-blue-500"  },
  stormy:  { icon: CloudLightning,  label: "Orageux",     bg: "bg-purple-50/80", text: "text-purple-700", border: "border-purple-100", accent: "text-purple-500"},
  snowy:   { icon: CloudSnow,       label: "Neigeux",     bg: "bg-sky-50/80",    text: "text-sky-700",    border: "border-sky-100",    accent: "text-sky-500"   },
  foggy:   { icon: CloudFog,        label: "Brouillard",  bg: "bg-gray-50/80",   text: "text-gray-700",   border: "border-gray-100",   accent: "text-gray-400"  },
};

const WeatherWidget = () => {
  const weather = useWeather();
  const w = weatherConfig[weather.condition] ?? weatherConfig.sunny;
  const Icon = w.icon;

  if (weather.loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-muted/40 border border-border/50 rounded-2xl p-3.5 flex items-center gap-4"
      >
        <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
        <span className="text-sm text-muted-foreground font-medium">Récupération de la météo…</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${w.bg} backdrop-blur-sm border ${w.border} rounded-2xl p-3.5 flex items-center gap-4 shadow-sm`}
    >
      <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center shadow-inner shrink-0">
        <Icon className={`w-7 h-7 ${w.accent}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-black text-xl ${w.text}`}>{weather.temp}°C</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-white/40 px-2 py-0.5 rounded-full border border-white/60">
            {w.label}
          </span>
          {weather.city && (
            <span className="text-[10px] font-semibold text-muted-foreground truncate">
              {weather.city}
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground font-bold mt-1 line-clamp-2 italic">
          "{weather.recommendation}"
        </p>
      </div>

      <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
          <Wind className="w-3 h-3" />
          <span>{weather.windSpeed} km/h</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
          <Droplets className="w-3 h-3" />
          <span>{weather.humidity}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
