import { motion } from "framer-motion";
import { Syringe, ShieldCheck } from "lucide-react";

interface DogCardProps {
  name: string;
  breed: string;
  image: string;
  emoji: string;
  status: "Actif" | "Disponible";
  isVaccinated?: boolean;
}

const DogCard = ({ name, breed, image, emoji, status, isVaccinated = true }: DogCardProps) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="bg-card rounded-2xl shadow-card overflow-hidden group border border-border/50"
  >
    <div className="relative">
      <img src={image} alt={name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      <div className="absolute inset-0 gradient-hero opacity-20" />
      {isVaccinated && (
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-sm" title="Vaccins à jour">
          <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
        </div>
      )}
    </div>
    <div className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base shrink-0">{emoji}</span>
          <span className="font-extrabold text-foreground truncate">{name}</span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mt-0.5 truncate font-medium">{breed}</p>
      
      <div className="flex items-center justify-between mt-2.5">
        <span
          className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
            status === "Actif" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
          }`}
        >
          <span className={`w-1 h-1 rounded-full ${status === "Actif" ? "bg-primary" : "bg-accent"}`} />
          {status === "Actif" ? "En mission" : "Disponible"}
        </span>
        
        {isVaccinated && (
          <div className="flex items-center gap-0.5 text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
            <Syringe className="w-2.5 h-2.5" />
            <span>Santé OK</span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

export default DogCard;
