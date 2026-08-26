import { motion } from "framer-motion";
import { Play, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

interface WalkerActionWidgetProps {
  walkerId: string;
  walkerName: string;
  walkerAvatar?: string;
  dogName: string;
  dogPhoto?: string;
  serviceType: string;
  scheduledTime: string;
  duration: number;
  status: "pending" | "ready" | "in_progress" | "completed";
  onStartService: () => void;
}

export const WalkerActionWidget = ({
  walkerId,
  walkerName,
  walkerAvatar,
  dogName,
  dogPhoto,
  serviceType,
  scheduledTime,
  duration,
  status,
  onStartService,
}: WalkerActionWidgetProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  // Simuler l'écoulement du temps si service en cours
  useEffect(() => {
    if (status !== "in_progress") return;
    const interval = setInterval(() => {
      setElapsedTime((prev) => (prev < duration ? prev + 1 : duration));
    }, 1000);
    return () => clearInterval(interval);
  }, [status, duration]);

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 border-amber-500/30 text-amber-600";
      case "ready":
        return "bg-blue-500/10 border-blue-500/30 text-blue-600";
      case "in_progress":
        return "bg-green-500/10 border-green-500/30 text-green-600";
      case "completed":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-600";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-600";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "pending":
        return "En attente";
      case "ready":
        return "Prêt à démarrer";
      case "in_progress":
        return "En cours";
      case "completed":
        return "Terminé";
      default:
        return "Statut inconnu";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-card p-4 border border-border/50 space-y-3"
    >
      {/* En-tête : Accompagnateur et Chien */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {walkerAvatar && (
            <img
              src={walkerAvatar}
              alt={walkerName}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-bold text-sm text-foreground">{walkerName}</p>
            <p className="text-xs text-muted-foreground">🐕 {dogName}</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full border text-xs font-bold ${getStatusColor()}`}>
          {getStatusLabel()}
        </div>
      </div>

      {/* Service et Horaires */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="font-semibold text-foreground">{serviceType}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>
            {scheduledTime} • {duration} min
          </span>
        </div>
        {status === "in_progress" && (
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            En cours : {elapsedTime}s / {duration * 60}s
          </div>
        )}
      </div>

      {/* Bouton d'action */}
      {status === "ready" && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartService}
          className="w-full py-2.5 rounded-xl bg-accent text-white font-bold flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors"
        >
          <Play className="w-4 h-4" />
          Démarrer le Service
        </motion.button>
      )}

      {status === "in_progress" && (
        <div className="w-full py-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 font-bold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Service en cours...
        </div>
      )}

      {status === "completed" && (
        <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-bold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Service Terminé
        </div>
      )}
    </motion.div>
  );
};

export default WalkerActionWidget;
