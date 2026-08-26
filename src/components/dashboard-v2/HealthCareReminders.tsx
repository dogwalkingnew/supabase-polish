import { motion } from "framer-motion";
import { Bell, CheckCircle, AlertCircle, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface HealthReminder {
  id: string;
  dogName: string;
  type: "vaccination" | "checkup" | "treatment";
  title: string;
  dueDate: string;
  daysUntilDue: number;
  isOverdue: boolean;
  notificationEnabled: boolean;
}

interface HealthCareRemindersProps {
  reminders: HealthReminder[];
  onToggleReminder?: (reminderId: string, enabled: boolean) => void;
}

const HealthCareReminders = ({ reminders, onToggleReminder }: HealthCareRemindersProps) => {
  const [upcomingReminders, setUpcomingReminders] = useState<HealthReminder[]>([]);

  useEffect(() => {
    // Trier les rappels par date d'échéance (les plus urgents d'abord)
    const sorted = [...reminders].sort((a, b) => a.daysUntilDue - b.daysUntilDue);
    setUpcomingReminders(sorted.slice(0, 5));
  }, [reminders]);

  const overdueCount = reminders.filter(r => r.isOverdue).length;
  const upcomingCount = reminders.filter(r => !r.isOverdue && r.daysUntilDue <= 7).length;

  const getReminderColor = (daysUntilDue: number, isOverdue: boolean) => {
    if (isOverdue) return "bg-red-50 border-red-200";
    if (daysUntilDue <= 3) return "bg-red-50 border-red-200";
    if (daysUntilDue <= 7) return "bg-amber-50 border-amber-200";
    return "bg-green-50 border-green-200";
  };

  const getReminderTextColor = (daysUntilDue: number, isOverdue: boolean) => {
    if (isOverdue) return "text-red-600";
    if (daysUntilDue <= 3) return "text-red-600";
    if (daysUntilDue <= 7) return "text-amber-600";
    return "text-green-600";
  };

  const formatDaysUntilDue = (daysUntilDue: number, isOverdue: boolean) => {
    if (isOverdue) return `${Math.abs(daysUntilDue)} jour(s) en retard`;
    if (daysUntilDue === 0) return "Aujourd'hui";
    if (daysUntilDue === 1) return "Demain";
    return `Dans ${daysUntilDue} jour(s)`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-card p-4 border border-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center">
            <Bell className="w-3 h-3 text-blue-600" />
          </div>
          Rappels Santé
        </h3>
        <div className="flex items-center gap-1.5">
          {overdueCount > 0 && (
            <span className="flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full bg-red-50 text-red-600">
              <AlertCircle className="w-3 h-3" />
              {overdueCount}
            </span>
          )}
          {upcomingCount > 0 && (
            <span className="flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full bg-amber-50 text-amber-600">
              <Calendar className="w-3 h-3" />
              {upcomingCount}
            </span>
          )}
        </div>
      </div>

      {upcomingReminders.length > 0 ? (
        <div className="space-y-2">
          {upcomingReminders.map((reminder, index) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-2.5 p-3 rounded-lg border ${getReminderColor(reminder.daysUntilDue, reminder.isOverdue)}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/50`}>
                {reminder.isOverdue || reminder.daysUntilDue <= 3 ? (
                  <AlertCircle className={`w-4 h-4 ${getReminderTextColor(reminder.daysUntilDue, reminder.isOverdue)}`} />
                ) : (
                  <Clock className={`w-4 h-4 ${getReminderTextColor(reminder.daysUntilDue, reminder.isOverdue)}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{reminder.title}</p>
                <p className="text-[8px] text-muted-foreground font-medium">{reminder.dogName}</p>
              </div>
              <div className="flex flex-col items-end shrink-0 gap-1">
                <span className={`text-[8px] font-black uppercase tracking-widest ${getReminderTextColor(reminder.daysUntilDue, reminder.isOverdue)}`}>
                  {formatDaysUntilDue(reminder.daysUntilDue, reminder.isOverdue)}
                </span>
                <button
                  onClick={() => onToggleReminder?.(reminder.id, !reminder.notificationEnabled)}
                  className={`text-[7px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                    reminder.notificationEnabled
                      ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {reminder.notificationEnabled ? "Actif" : "Inactif"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <CheckCircle className="w-8 h-8 text-green-600/30 mx-auto mb-2" />
          <p className="text-xs font-bold text-muted-foreground">Tous les rappels sont à jour ✓</p>
        </div>
      )}

      <button className="w-full mt-3 py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors uppercase tracking-wider">
        Gérer tous les rappels
      </button>
    </motion.div>
  );
};

export default HealthCareReminders;
