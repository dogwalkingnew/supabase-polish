import { AlertTriangle, Lightbulb, CheckCircle2, Clock, Thermometer, Cloud, AlertCircle, TrendingUp, Heart, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface Alert {
  id: string;
  type: "urgent" | "warning" | "info";
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
  timestamp?: string;
}

interface Recommendation {
  id: string;
  icon: any;
  title: string;
  description: string;
  benefit: string;
  action: string;
  onAction?: () => void;
}

interface OwnerAlertsAndRecommendationsProps {
  alerts: Alert[];
  recommendations: Recommendation[];
}

const OwnerAlertsAndRecommendations = ({
  alerts,
  recommendations,
}: OwnerAlertsAndRecommendationsProps) => {
  const getAlertStyles = (type: string) => {
    switch (type) {
      case "urgent":
        return {
          bg: "bg-[#E74C3C]/10",
          border: "border-[#E74C3C]/30",
          icon: "text-[#E74C3C]",
          badge: "bg-[#E74C3C] text-white",
          iconBg: "bg-[#E74C3C]/20",
        };
      case "warning":
        return {
          bg: "bg-[#D4A574]/10",
          border: "border-[#D4A574]/30",
          icon: "text-[#D4A574]",
          badge: "bg-[#D4A574] text-white",
          iconBg: "bg-[#D4A574]/20",
        };
      default:
        return {
          bg: "bg-[#1E7B5F]/10",
          border: "border-[#1E7B5F]/30",
          icon: "text-[#1E7B5F]",
          badge: "bg-[#1E7B5F] text-white",
          iconBg: "bg-[#1E7B5F]/20",
        };
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return AlertCircle;
      case "warning":
        return AlertTriangle;
      default:
        return CheckCircle2;
    }
  };

  return (
    <div className="space-y-6">
      {/* Alertes */}
      {alerts.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-[#1A1A2E] mb-3 px-1">🚨 Alertes Importantes</h3>
          <div className="space-y-2">
            {alerts.map((alert, idx) => {
              const styles = getAlertStyles(alert.type);
              const Icon = getAlertIcon(alert.type);

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`${styles.bg} border ${styles.border} rounded-2xl p-4`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg ${styles.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className={`w-5 h-5 ${styles.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-[#1A1A2E]">{alert.title}</h4>
                        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${styles.badge} shrink-0`}>
                          {alert.type === "urgent" ? "URGENT" : alert.type === "warning" ? "⚠️" : "ℹ️"}
                        </span>
                      </div>
                      <p className="text-sm text-[#5C5C70] mb-2">{alert.description}</p>
                      {alert.action && (
                        <button
                          onClick={alert.onAction}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                            alert.type === "urgent"
                              ? "bg-[#E74C3C] text-white hover:bg-[#C73D2D]"
                              : alert.type === "warning"
                              ? "bg-[#D4A574] text-white hover:bg-[#B8860B]"
                              : "bg-[#1E7B5F] text-white hover:bg-[#165A47]"
                          }`}
                        >
                          {alert.action}
                        </button>
                      )}
                      {alert.timestamp && (
                        <p className="text-[10px] text-[#8A8A99] mt-2">{alert.timestamp}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Recommandations */}
      {recommendations.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-[#1A1A2E] mb-3 px-1">💡 Recommandations Personnalisées</h3>
          <div className="space-y-2">
            {recommendations.map((rec, idx) => {
              const Icon = rec.icon;

              return (
                <motion.button
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={rec.onAction}
                  className="w-full bg-white rounded-2xl shadow-[0_2px_10px_rgba(26,26,46,0.06)] p-4 hover:shadow-[0_4px_20px_rgba(26,26,46,0.12)] transition-shadow text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#1E7B5F]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-[#1E7B5F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#1A1A2E] mb-1">{rec.title}</h4>
                      <p className="text-sm text-[#5C5C70] mb-2">{rec.description}</p>
                      <div className="flex items-center gap-2 text-xs text-[#1E7B5F] font-bold">
                        <TrendingUp className="w-3 h-3" />
                        {rec.benefit}
                      </div>
                    </div>
                    <div className="text-[#1E7B5F] font-bold">→</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>
      )}

      {/* Aucune alerte */}
      {alerts.length === 0 && recommendations.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(26,26,46,0.06)] p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#27AE60]/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-[#27AE60]" />
          </div>
          <h3 className="font-bold text-[#1A1A2E] mb-2">Tout va bien ! ✨</h3>
          <p className="text-sm text-[#5C5C70]">Aucune alerte. Vos animaux sont en bonne santé et vos services sont à jour.</p>
        </motion.div>
      )}
    </div>
  );
};

export default OwnerAlertsAndRecommendations;
