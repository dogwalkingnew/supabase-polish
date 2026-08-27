/**
 * DogWalking — indicateurs administratifs factuels : les statuts affichés sont
 * strictement issus des réservations réelles et ne décrivent ni conversion ni performance simulée.
 */
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Clock, TrendingUp } from "lucide-react";

interface SelectionFlowChartProps {
  totalBookings: number;
  pendingBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

const SelectionFlowChart = ({
  totalBookings,
  pendingBookings,
  activeBookings,
  completedBookings,
  cancelledBookings,
}: SelectionFlowChartProps) => {
  const completedRate = totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : "0";
  const statuses = [
    { label: "En attente", count: pendingBookings, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Confirmées ou en cours", count: activeBookings, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
    { label: "Terminées", count: completedBookings, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Annulées", count: cancelledBookings, icon: AlertCircle, color: "text-muted-foreground", bg: "bg-muted" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-card p-4 border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <span className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center"><TrendingUp className="w-3 h-3 text-primary" /></span>
          État des réservations
        </h3>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black border border-primary/20">
          <CheckCircle className="w-3 h-3" />
          {completedRate}% terminées
        </div>
      </div>

      <div className="space-y-3">
        {statuses.map((status, index) => {
          const Icon = status.icon;
          const percentage = totalBookings > 0 ? (status.count / totalBookings) * 100 : 0;
          return (
            <motion.div key={status.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${status.bg}`}><Icon className={`w-4 h-4 ${status.color}`} /></span>
                  <p className="text-xs font-bold text-foreground">{status.label}</p>
                </div>
                <div className="text-right"><p className={`text-sm font-black ${status.color}`}>{status.count}</p><p className="text-[8px] text-muted-foreground">{percentage.toFixed(1)}%</p></div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ delay: index * 0.1, duration: 0.6 }} className={`h-full rounded-full ${status.bg}`} /></div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-dashed border-border grid grid-cols-3 gap-2">
        <div className="text-center"><p className="text-lg font-black text-primary">{totalBookings}</p><p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Total</p></div>
        <div className="text-center"><p className="text-lg font-black text-accent">{activeBookings}</p><p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Actives</p></div>
        <div className="text-center"><p className="text-lg font-black text-green-600">{completedBookings}</p><p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Terminées</p></div>
      </div>
    </motion.div>
  );
};

export default SelectionFlowChart;
