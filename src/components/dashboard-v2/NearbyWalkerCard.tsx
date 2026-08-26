import StarRating from "./StarRating";
import avatarWalker from "@/assets/avatar-walker.jpg";
import { motion } from "framer-motion";
import { MapPin, ShieldCheck, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NearbyWalkerProps {
  name: string;
  rating: number;
  reviews: number;
  distance: string;
  price: string;
  avatar?: string;
  badges?: string[];
  walkerId?: string;
}

const NearbyWalkerCard = ({ name, rating, reviews, distance, price, avatar, badges = [], walkerId }: NearbyWalkerProps) => {
  const navigate = useNavigate();
  return (
  <motion.div
    whileHover={{ y: -2, scale: 1.01 }}
    onClick={() => walkerId && navigate(`/walker/${walkerId}`)}
    role={walkerId ? "button" : undefined}
    tabIndex={walkerId ? 0 : undefined}
    onKeyDown={(e) => { if (walkerId && (e.key === "Enter" || e.key === " ")) navigate(`/walker/${walkerId}`); }}
    className={`bg-card rounded-2xl shadow-card p-3.5 flex items-center gap-3 border border-border/50 hover:border-primary/20 transition-all ${walkerId ? "cursor-pointer" : ""}`}
  >
    <div className="relative shrink-0">
      <img
        src={avatar || avatarWalker}
        alt={name}
        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/10 shadow-sm"
        loading="lazy"
      />
      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg gradient-primary border-2 border-card flex items-center justify-center shadow-sm">
        <ShieldCheck className="w-3 h-3 text-white" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="font-black text-sm text-foreground truncate">{name}</span>
        {badges.includes("Certifié") && (
          <div className="flex items-center gap-0.5 text-[8px] font-black px-1.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-tighter">
            <Award className="w-2.5 h-2.5" />
            Certifié
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5 mt-1">
        <StarRating rating={rating} />
        <span className="text-[10px] text-muted-foreground font-bold">({reviews} avis)</span>
      </div>
      <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground font-medium">
        <MapPin className="w-3 h-3 text-primary/60" />
        <span>{distance} • Lyon</span>
      </div>
    </div>
    <div className="text-right shrink-0">
      <div className="flex flex-col items-end">
        <span className="text-base font-black text-primary leading-none">{price}</span>
        <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mt-1">/ mission</p>
      </div>
    </div>
  </motion.div>
  );
};

export default NearbyWalkerCard;
