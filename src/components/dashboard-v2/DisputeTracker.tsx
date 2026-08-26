import { motion } from "framer-motion";
import { AlertTriangle, Clock, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Dispute {
  id: string;
  bookingId: string;
  ownerName: string;
  walkerName: string;
  reason: string;
  status: "open" | "in_review" | "resolved" | "rejected";
  createdAt: string;
  priority: "low" | "medium" | "high";
}

interface DisputeTrackerProps {
  disputes: Dispute[];
  limit?: number;
}

const statusConfig = {
  open: { icon: AlertTriangle, label: "Ouvert", color: "text-amber-600", bg: "bg-amber-50" },
  in_review: { icon: Clock, label: "En révision", color: "text-blue-600", bg: "bg-blue-50" },
  resolved: { icon: CheckCircle, label: "Résolu", color: "text-green-600", bg: "bg-green-50" },
  rejected: { icon: XCircle, label: "Rejeté", color: "text-red-600", bg: "bg-red-50" },
};

const priorityConfig = {
  low: { label: "Faible", color: "text-muted-foreground" },
  medium: { label: "Moyen", color: "text-amber-600" },
  high: { label: "Urgent", color: "text-red-600" },
};

const DisputeTracker = ({ disputes, limit = 5 }: DisputeTrackerProps) => {
  const displayedDisputes = disputes.slice(0, limit);
  const openCount = disputes.filter(d => d.status === "open").length;
  const inReviewCount = disputes.filter(d => d.status === "in_review").length;

  if (!displayedDisputes.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card rounded-2xl shadow-card p-6 text-center border border-border/50"
      >
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-sm font-bold text-foreground">Aucun litige</p>
        <p className="text-xs text-muted-foreground mt-1">Plateforme en bon état</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-card p-4 border border-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-3 h-3 text-red-600" />
          </div>
          Litiges
        </h3>
        <div className="flex items-center gap-2">
          {openCount > 0 && (
            <span className="flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full bg-red-50 text-red-600">
              <AlertTriangle className="w-3 h-3" />
              {openCount}
            </span>
          )}
          {inReviewCount > 0 && (
            <span className="flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full bg-blue-50 text-blue-600">
              <Clock className="w-3 h-3" />
              {inReviewCount}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {displayedDisputes.map((dispute, index) => {
          const statusConf = statusConfig[dispute.status];
          const priorityConf = priorityConfig[dispute.priority];
          const StatusIcon = statusConf.icon;

          return (
            <motion.div
              key={dispute.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-lg border border-transparent ${statusConf.bg} hover:shadow-md transition-all`}
            >
              <div className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center shrink-0">
                <StatusIcon className={`w-4 h-4 ${statusConf.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-sm text-foreground truncate">
                    {dispute.ownerName} vs {dispute.walkerName}
                  </p>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${priorityConf.color} whitespace-nowrap`}>
                    {priorityConf.label}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium truncate">{dispute.reason}</p>
                <p className="text-[8px] text-muted-foreground/60 mt-1">
                  {format(new Date(dispute.createdAt), "d MMM HH:mm", { locale: fr })}
                </p>
              </div>

              <button className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center shrink-0 hover:bg-white transition-colors">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {disputes.length > limit && (
        <button className="w-full mt-3 py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors uppercase tracking-wider">
          Voir tous les litiges ({disputes.length})
        </button>
      )}
    </motion.div>
  );
};

export default DisputeTracker;
