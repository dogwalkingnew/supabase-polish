import { CalendarDays, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface GoButtonProps {
  label: string;
  onClick?: () => void;
  icon?: "calendar" | "go";
}

const GoButton = ({ label, onClick, icon = "calendar" }: GoButtonProps) => {
  const isGo = icon === "go";
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      className={`relative w-full h-[72px] rounded-[18px] bg-[#10B981] text-white flex items-center ${isGo ? "justify-between pl-6 pr-3" : "justify-between pl-3 pr-5"} shadow-[0_8px_24px_-12px_rgba(30,123,95,0.6)] ring-1 ring-[#176650]`}
    >
      {!isGo && (
        <span className="w-14 h-14 rounded-full bg-[#0F4F3D]/40 ring-1 ring-[#D4A574]/60 flex items-center justify-center shrink-0">
          <CalendarDays className="w-7 h-7 text-[#D4A574]" strokeWidth={1.6} />
        </span>
      )}
      <span className={`text-xl font-bold tracking-[0.04em] uppercase ${isGo ? "flex-1 text-center" : ""}`}>{label}</span>
      {isGo ? (
        <span className="w-14 h-14 rounded-full bg-[#D4A574] flex items-center justify-center shrink-0 shadow-md">
          <span className="text-[#0F4F3D] font-black text-lg tracking-tight">GO</span>
        </span>
      ) : (
        <ChevronRight className="w-7 h-7 text-white/90 shrink-0" strokeWidth={2} />
      )}
    </motion.button>
  );
};

export default GoButton;
