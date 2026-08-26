import { motion } from "framer-motion";
import { CheckCircle, Clock, AlertCircle, Camera, MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TimelineEvent {
  id: string;
  type: "completed" | "pending" | "cancelled" | "photo";
  dogName: string;
  walkerName: string;
  date: string;
  time: string;
  duration?: number;
  status: string;
  photoCount?: number;
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
  limit?: number;
}

const statusConfig = {
  completed: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", label: "Terminée" },
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", label: "En attente" },
  cancelled: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", label: "Annulée" },
  photo: { icon: Camera, color: "text-blue-600", bg: "bg-blue-50", label: "Preuves" },
};

const ActivityTimeline = ({ events, limit = 5 }: ActivityTimelineProps) => {
  const displayedEvents = events.slice(0, limit);

  if (!displayedEvents.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card rounded-2xl shadow-card p-6 text-center border border-border/50"
      >
        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
          <Clock className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-bold text-foreground">Aucune activité</p>
        <p className="text-xs text-muted-foreground mt-1">Vos missions apparaîtront ici</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-card p-4 border border-border/50"
    >
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center">
          <Clock className="w-3 h-3 text-primary" />
        </div>
        Activité Récente
      </h3>

      <div className="space-y-3">
        {displayedEvents.map((event, index) => {
          const config = statusConfig[event.type] || statusConfig.pending;
          const Icon = config.icon;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative flex gap-3 p-3 rounded-xl border transition-all hover:shadow-md ${config.bg} border-transparent`}
            >
              {/* Timeline connector */}
              {index < displayedEvents.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-6 bg-gradient-to-b from-current to-transparent opacity-20" />
              )}

              {/* Status icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.bg} border-2 border-current`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-sm text-foreground">
                      {event.dogName} avec {event.walkerName}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground font-medium">
                      <span>{format(new Date(event.date), "d MMM", { locale: fr })}</span>
                      <span>•</span>
                      <span>{event.time}</span>
                      {event.duration && (
                        <>
                          <span>•</span>
                          <span>{event.duration} min</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${config.color} bg-white/50 whitespace-nowrap`}>
                    {config.label}
                  </span>
                </div>

                {/* Photo count or location */}
                {event.photoCount && (
                  <div className="flex items-center gap-1 mt-2 text-[9px] text-muted-foreground font-bold">
                    <Camera className="w-3 h-3" />
                    <span>{event.photoCount} photo{event.photoCount > 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {events.length > limit && (
        <button className="w-full mt-4 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors">
          Voir tout l'historique ({events.length})
        </button>
      )}
    </motion.div>
  );
};

export default ActivityTimeline;
