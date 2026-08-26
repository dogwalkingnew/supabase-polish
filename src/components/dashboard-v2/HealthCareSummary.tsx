import { motion } from "framer-motion";
import { Heart, AlertCircle, CheckCircle, Calendar, Pill, ShieldCheck } from "lucide-react";

interface HealthRecord {
  id: string;
  dogName: string;
  type: "vaccination" | "checkup" | "treatment" | "alert";
  title: string;
  date: string;
  nextDate?: string;
  status: "ok" | "warning" | "alert";
  veterinarian?: string;
}

interface HealthCareSummaryProps {
  records: HealthRecord[];
  dogsCount: number;
}

const typeConfig = {
  vaccination: { icon: ShieldCheck, label: "Vaccination", color: "text-green-600", bg: "bg-green-50" },
  checkup: { icon: Heart, label: "Visite", color: "text-blue-600", bg: "bg-blue-50" },
  treatment: { icon: Pill, label: "Traitement", color: "text-amber-600", bg: "bg-amber-50" },
  alert: { icon: AlertCircle, label: "Alerte", color: "text-red-600", bg: "bg-red-50" },
};

const statusConfig = {
  ok: { icon: CheckCircle, color: "text-green-600", label: "À jour" },
  warning: { icon: AlertCircle, color: "text-amber-600", label: "Bientôt" },
  alert: { icon: AlertCircle, color: "text-red-600", label: "Urgent" },
};

const HealthCareSummary = ({ records, dogsCount }: HealthCareSummaryProps) => {
  const alertCount = records.filter(r => r.status === "alert").length;
  const warningCount = records.filter(r => r.status === "warning").length;
  const recentRecords = records.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-card p-4 border border-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-heart/10 flex items-center justify-center">
            <Heart className="w-3 h-3 text-heart" />
          </div>
          Carnet de Santé
        </h3>
        <div className="flex items-center gap-1.5">
          {alertCount > 0 && (
            <span className="flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full bg-red-50 text-red-600">
              <AlertCircle className="w-3 h-3" />
              {alertCount}
            </span>
          )}
          {warningCount > 0 && (
            <span className="flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full bg-amber-50 text-amber-600">
              <Calendar className="w-3 h-3" />
              {warningCount}
            </span>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-muted/30 rounded-lg p-2.5 text-center">
          <p className="text-lg font-black text-foreground">{dogsCount}</p>
          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Animaux</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-2.5 text-center">
          <p className="text-lg font-black text-foreground">{records.length}</p>
          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Dossiers</p>
        </div>
      </div>

      {/* Recent records */}
      {recentRecords.length > 0 ? (
        <div className="space-y-2">
          {recentRecords.map((record, index) => {
            const typeConf = typeConfig[record.type];
            const statusConf = statusConfig[record.status];
            const TypeIcon = typeConf.icon;
            const StatusIcon = statusConf.icon;

            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg border border-transparent ${typeConf.bg}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/50`}>
                  <TypeIcon className={`w-4 h-4 ${typeConf.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{record.title}</p>
                  <p className="text-[8px] text-muted-foreground font-medium">{record.dogName}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <StatusIcon className={`w-3 h-3 ${statusConf.color}`} />
                  <span className={`text-[8px] font-black uppercase tracking-widest ${statusConf.color}`}>
                    {statusConf.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6">
          <Heart className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs font-bold text-muted-foreground">Aucun dossier médical</p>
        </div>
      )}

      <button className="w-full mt-3 py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors uppercase tracking-wider">
        Gérer le carnet complet
      </button>
    </motion.div>
  );
};

export default HealthCareSummary;
