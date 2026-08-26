import { Calendar, MapPin, Clock, Star, Euro, Search, Bell, Heart, PlusCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface QuickAction {
  icon: LucideIcon;
  label: string;
  gradient: string;
  path?: string;
  badge?: number | string;
  priority?: boolean;
}

const QuickActions = ({ role, notifications = {} }: { role: "owner" | "walker", notifications?: { bookings?: number, messages?: number, dogs?: number } }) => {
  const navigate = useNavigate();

  const ownerActions: QuickAction[] = [
    { icon: Search, label: "Réserver", gradient: "gradient-primary", path: "/find-walkers", priority: true },
    { icon: Calendar, label: "Missions", gradient: "gradient-accent", path: "/dashboard?tab=reservations", badge: notifications.bookings },
    { icon: PlusCircle, label: "Ajouter", gradient: "gradient-passion", path: "/dashboard?tab=chiens" },
    { icon: Heart, label: "Favoris", gradient: "gradient-community", path: "/dashboard?tab=favoris" },
  ];

  const walkerActions: QuickAction[] = [
    { icon: Calendar, label: "Planning", gradient: "gradient-primary", path: "/walker/dashboard?tab=missions", badge: notifications.bookings, priority: true },
    { icon: Clock, label: "Dispo", gradient: "gradient-accent", path: "/walker/dashboard?tab=disponibilite" },
    { icon: Euro, label: "Revenus", gradient: "gradient-passion", path: "/walker/dashboard?tab=gains" },
    { icon: Star, label: "Avis", gradient: "gradient-community", path: "/walker/dashboard?tab=avis" },
  ];

  const actions = role === "owner" ? ownerActions : walkerActions;

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => action.path && navigate(action.path)}
          className={`relative bg-card rounded-2xl shadow-card p-3 flex flex-col items-center gap-2 hover:shadow-card-hover transition-all duration-300 ${action.priority ? 'ring-2 ring-primary/20 ring-offset-2 ring-offset-background' : ''}`}
        >
          {action.badge && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-sm ring-2 ring-background animate-in zoom-in duration-300">
              {action.badge}
            </span>
          )}
          <div className={`w-11 h-11 rounded-xl ${action.gradient} flex items-center justify-center shadow-card group-hover:scale-110 transition-transform`}>
            <action.icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-bold text-foreground text-center line-clamp-1">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default QuickActions;
