import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

interface ScheduledMission {
  date: string;
  time: string;
  dogName: string;
  duration: number;
  status: "confirmed" | "pending";
}

interface PlanningCalendarProps {
  missions: ScheduledMission[];
}

const PlanningCalendar = ({ missions }: PlanningCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getMissionsForDay = (day: Date) => {
    return missions.filter(m => isSameDay(new Date(m.date), day));
  };

  const daysWithMissions = new Set(
    missions.map(m => new Date(m.date).toDateString())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-card p-4 border border-border/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="w-3 h-3 text-primary" />
          </div>
          Planning
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="w-7 h-7 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-muted-foreground min-w-[80px] text-center uppercase tracking-widest">
            {format(currentMonth, "MMM yyyy", { locale: fr })}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="w-7 h-7 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(day => (
          <div key={day} className="text-center text-[8px] font-black text-muted-foreground uppercase tracking-widest py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, index) => {
          const dayMissions = getMissionsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <motion.div
              key={day.toDateString()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`aspect-square rounded-lg p-1 text-center text-[9px] font-bold border-2 transition-all hover:shadow-md ${
                isToday
                  ? "bg-primary/10 border-primary text-primary"
                  : dayMissions.length > 0
                  ? "bg-accent/10 border-accent text-accent"
                  : isCurrentMonth
                  ? "bg-muted/30 border-border text-muted-foreground"
                  : "bg-muted/10 border-border/30 text-muted-foreground/50"
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span>{day.getDate()}</span>
                {dayMissions.length > 0 && (
                  <span className="text-[7px] font-black mt-0.5 px-1 py-0.5 rounded-full bg-current/20">
                    {dayMissions.length}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-dashed border-border flex items-center justify-around text-[9px] font-bold">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary/10 border border-primary" />
          <span className="text-muted-foreground">Aujourd'hui</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-accent/10 border border-accent" />
          <span className="text-muted-foreground">Missions</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PlanningCalendar;
