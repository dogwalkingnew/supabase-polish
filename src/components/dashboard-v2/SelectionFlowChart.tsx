import { motion } from "framer-motion";
import { ArrowRight, Users, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";

interface FlowStage {
  label: string;
  count: number;
  percentage: number;
  icon: any;
  color: string;
  bg: string;
}

interface SelectionFlowChartProps {
  totalRequests: number;
  stages: FlowStage[];
}

const SelectionFlowChart = ({ totalRequests, stages }: SelectionFlowChartProps) => {
  const conversionRate = stages.length > 0 ? ((stages[stages.length - 1].count / totalRequests) * 100).toFixed(1) : "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-card p-4 border border-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-primary" />
          </div>
          Flux de Sélection
        </h3>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black border border-primary/20">
          <CheckCircle className="w-3 h-3" />
          {conversionRate}%
        </div>
      </div>

      {/* Flow visualization */}
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const progressWidth = (stage.count / totalRequests) * 100;

          return (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-1.5"
            >
              {/* Stage header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stage.bg}`}>
                    <Icon className={`w-4 h-4 ${stage.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{stage.label}</p>
                    <p className="text-[8px] text-muted-foreground">{stage.count} demandes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${stage.color}`}>{stage.percentage}%</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressWidth}%` }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className={`h-full rounded-full ${stage.bg}`}
                />
              </div>

              {/* Arrow */}
              {index < stages.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowRight className="w-4 h-4 text-muted-foreground/30 rotate-90" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-dashed border-border grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-lg font-black text-primary">{totalRequests}</p>
          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Total</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-accent">{stages[Math.floor(stages.length / 2)]?.count || 0}</p>
          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Moyen</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-green-600">{stages[stages.length - 1]?.count || 0}</p>
          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Finalisé</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SelectionFlowChart;
