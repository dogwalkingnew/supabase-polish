import { motion } from "framer-motion";
import { Users, AlertTriangle, TrendingUp, Zap, Shield } from "lucide-react";

interface AdminMetricsProps {
  totalUsers: number;
  activeWalkers: number;
  openDisputes: number;
  completionRate: number;
  verificationRate: number;
}

const AdminMetrics = ({
  totalUsers,
  activeWalkers,
  openDisputes,
  completionRate,
  verificationRate,
}: AdminMetricsProps) => {
  const metrics = [
    {
      icon: Users,
      label: "Utilisateurs",
      value: totalUsers,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Zap,
      label: "Accompagnateurs",
      value: activeWalkers,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: AlertTriangle,
      label: "Litiges Ouverts",
      value: openDisputes,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      icon: TrendingUp,
      label: "Missions terminées",
      value: `${completionRate}%`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Shield,
      label: "Vérification",
      value: `${verificationRate}%`,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="font-bold text-lg text-foreground">Métriques Clés</h2>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`${metric.bg} rounded-xl p-3 border border-transparent hover:shadow-lg transition-all`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                </div>
              </div>
              <p className={`text-xl font-black ${metric.color} line-clamp-1`}>{metric.value}</p>
              <p className="text-[9px] font-bold text-muted-foreground mt-1 line-clamp-2">{metric.label}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AdminMetrics;
