import { motion } from "framer-motion";
import { Calendar, CheckCircle, Clock, TrendingUp, Target } from "lucide-react";

interface MissionStatsProps {
  thisMonth: number;
  thisWeek: number;
  completed: number;
  pending: number;
  trend: number;
}

const MissionStats = ({ thisMonth, thisWeek, completed, pending, trend }: MissionStatsProps) => {
  const stats = [
    { icon: Target, label: "Ce mois", value: thisMonth, color: "text-primary", bg: "bg-primary/10" },
    { icon: Calendar, label: "Cette semaine", value: thisWeek, color: "text-accent", bg: "bg-accent/10" },
    { icon: CheckCircle, label: "Terminées", value: completed, color: "text-green-600", bg: "bg-green-50" },
    { icon: Clock, label: "En attente", value: pending, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-card p-4 border border-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="w-3 h-3 text-primary" />
          </div>
          Mes Missions
        </h3>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black border border-green-100">
          <TrendingUp className="w-3 h-3" />
          +{trend}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`${stat.bg} rounded-xl p-3 border border-transparent hover:shadow-md transition-all`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
              </div>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-dashed border-border flex items-center justify-between">
        <span className="text-[10px] font-bold text-muted-foreground">Objectif mensuel</span>
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${Math.min((thisMonth / 20) * 100, 100)}%` }} />
          </div>
          <span className="text-[10px] font-black text-primary">{Math.min(thisMonth, 20)}/20</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MissionStats;
